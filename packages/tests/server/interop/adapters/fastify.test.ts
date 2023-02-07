import ws from '@fastify/websocket';
import { waitFor } from '@testing-library/react';
import {
  HTTPHeaders,
  createTRPCClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from '@trpc/client/src';
import { inferAsyncReturnType, router } from '@trpc/server/src';
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from '@trpc/server/src/adapters/fastify';
import { observable } from '@trpc/server/src/observable';
import AbortController from 'abort-controller';
import { EventEmitter } from 'events';
import { expectTypeOf } from 'expect-type';
import fastify from 'fastify';
import fp from 'fastify-plugin';
import fetch from 'node-fetch';
import { z } from 'zod';

const config = {
  port: 2022,
  logger: false,
  prefix: '/trpc',
};

function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };
  return { req, res, user };
}

type Context = inferAsyncReturnType<typeof createContext>;

interface Message {
  id: string;
}

function createAppRouter() {
  const ee = new EventEmitter();
  const onNewMessageSubscription = jest.fn();
  const onSubscriptionEnded = jest.fn();
  const appRouter = router<Context>()
    .query('ping', {
      resolve() {
        return 'pong';
      },
    })
    .query('hello', {
      input: z
        .object({
          username: z.string().nullish(),
        })
        .nullish(),
      resolve({ input, ctx }) {
        return {
          text: `hello ${input?.username ?? ctx.user?.name ?? 'world'}`,
        };
      },
    })
    .mutation('post.edit', {
      input: z.object({
        id: z.string(),
        data: z.object({
          title: z.string(),
          text: z.string(),
        }),
      }),
      async resolve({ input, ctx }) {
        if (ctx.user.name === 'anonymous') {
          return { error: 'Unauthorized user' };
        }
        const { id, data } = input;
        return { id, ...data };
      },
    })
    .subscription('onMessage', {
      resolve() {
        const sub = observable<Message>((emit) => {
          const onMessage = (data: Message) => {
            emit.next(data);
          };
          ee.on('server:msg', onMessage);
          return () => {
            onSubscriptionEnded();
            ee.off('server:msg', onMessage);
          };
        });
        ee.emit('subscription:created');
        onNewMessageSubscription();
        return sub;
      },
    })
    .interop();

  return { appRouter, ee, onNewMessageSubscription, onSubscriptionEnded };
}

type CreateAppRouter = inferAsyncReturnType<typeof createAppRouter>;
type AppRouter = CreateAppRouter['appRouter'];

interface ServerOptions {
  appRouter: AppRouter;
  fastifyPluginWrapper?: boolean;
}

type PostPayload = { Body: { text: string; life: number } };

function createServer(opts: ServerOptions) {
  const instance = fastify({ logger: config.logger });

  const plugin = !!opts.fastifyPluginWrapper
    ? fp(fastifyTRPCPlugin)
    : fastifyTRPCPlugin;

  instance.register(ws);
  instance.register(plugin, {
    useWSS: true,
    prefix: config.prefix,
    trpcOptions: { router: opts.appRouter, createContext },
  });

  instance.get('/hello', async () => {
    return { hello: 'GET' };
  });

  instance.post<PostPayload>('/hello', async ({ body }) => {
    return { hello: 'POST', body };
  });

  const stop = () => {
    instance.close();
  };
  const start = async () => {
    try {
      await instance.listen(config.port);
    } catch (err) {
      instance.log.error(err);
    }
  };

  return { instance, start, stop };
}

interface ClientOptions {
  headers?: HTTPHeaders;
}

function createClient(opts: ClientOptions = {}) {
  const host = `localhost:${config.port}${config.prefix}`;
  const wsClient = createWSClient({ url: `ws://${host}` });
  const client = createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition(op) {
          return op.type === 'subscription';
        },
        true: wsLink({ client: wsClient }),
        false: httpLink({
          url: `http://${host}`,
          headers: opts.headers,
          AbortController: AbortController as any,
          fetch: fetch as any,
        }),
      }),
    ],
  });

  return { client, wsClient };
}

interface AppOptions {
  clientOptions?: ClientOptions;
  serverOptions?: Partial<ServerOptions>;
}

function createApp(opts: AppOptions = {}) {
  const { appRouter, ee } = createAppRouter();
  const { instance, start, stop } = createServer({
    ...(opts.serverOptions ?? {}),
    appRouter,
  });
  const { client } = createClient(opts.clientOptions);

  return { server: instance, start, stop, client, ee };
}

let app: inferAsyncReturnType<typeof createApp>;

describe('anonymous user', () => {
  beforeEach(async () => {
    app = createApp();
    await app.start();
  });

  afterEach(() => app.stop());

  test('fetch POST', async () => {
    const data = { text: 'life', life: 42 };
    const req = await fetch(`http://localhost:${config.port}/hello`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // body should be object
    expect(await req.json()).toMatchInlineSnapshot(`
      Object {
        "body": Object {
          "life": 42,
          "text": "life",
        },
        "hello": "POST",
      }
    `);
  });

  test('query', async () => {
    expect(await app.client.query('ping')).toMatchInlineSnapshot(`"pong"`);
    expect(await app.client.query('hello')).toMatchInlineSnapshot(`
          Object {
            "text": "hello anonymous",
          }
      `);
    expect(
      await app.client.query('hello', {
        username: 'test',
      }),
    ).toMatchInlineSnapshot(`
          Object {
            "text": "hello test",
          }
      `);
  });

  test('mutation', async () => {
    expect(
      await app.client.mutation('post.edit', {
        id: '42',
        data: { title: 'new_title', text: 'new_text' },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "error": "Unauthorized user",
      }
    `);
  });

  test('subscription', async () => {
    app.ee.once('subscription:created', () => {
      setTimeout(() => {
        app.ee.emit('server:msg', {
          id: '1',
        });
        app.ee.emit('server:msg', {
          id: '2',
        });
      });
    });

    const onStartedMock = jest.fn();
    const onDataMock = jest.fn();
    const sub = app.client.subscription('onMessage', undefined, {
      onStarted: onStartedMock,
      onData(data) {
        expectTypeOf(data).not.toBeAny();
        expectTypeOf(data).toMatchTypeOf<Message>();
        onDataMock(data);
      },
    });

    await waitFor(() => {
      expect(onStartedMock).toHaveBeenCalledTimes(1);
      expect(onDataMock).toHaveBeenCalledTimes(2);
    });

    app.ee.emit('server:msg', {
      id: '3',
    });

    await waitFor(() => {
      expect(onDataMock).toHaveBeenCalledTimes(3);
    });

    expect(onDataMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "id": "1",
          },
        ],
        Array [
          Object {
            "id": "2",
          },
        ],
        Array [
          Object {
            "id": "3",
          },
        ],
      ]
    `);

    sub.unsubscribe();

    await waitFor(() => {
      expect(app.ee.listenerCount('server:msg')).toBe(0);
      expect(app.ee.listenerCount('server:error')).toBe(0);
    });
  });
});

describe('authorized user', () => {
  beforeEach(async () => {
    app = createApp({ clientOptions: { headers: { username: 'nyan' } } });
    await app.start();
  });

  afterEach(() => app.stop());

  test('query', async () => {
    expect(await app.client.query('hello')).toMatchInlineSnapshot(`
      Object {
        "text": "hello nyan",
      }
    `);
  });

  test('mutation', async () => {
    expect(
      await app.client.mutation('post.edit', {
        id: '42',
        data: { title: 'new_title', text: 'new_text' },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "id": "42",
        "text": "new_text",
        "title": "new_title",
      }
    `);
  });
});

describe('anonymous user with fastify-plugin', () => {
  beforeEach(async () => {
    app = createApp({ serverOptions: { fastifyPluginWrapper: true } });
    await app.start();
  });

  afterEach(() => app.stop());

  test('fetch GET', async () => {
    const req = await fetch(`http://localhost:${config.port}/hello`);
    expect(await req.json()).toEqual({ hello: 'GET' });
  });

  test('fetch POST', async () => {
    const data = { text: 'life', life: 42 };
    const req = await fetch(`http://localhost:${config.port}/hello`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // body should be string
    expect(await req.json()).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"text\\":\\"life\\",\\"life\\":42}",
        "hello": "POST",
      }
    `);
  });

  test('query', async () => {
    expect(await app.client.query('ping')).toMatchInlineSnapshot(`"pong"`);
    expect(await app.client.query('hello')).toMatchInlineSnapshot(`
          Object {
            "text": "hello anonymous",
          }
      `);
    expect(
      await app.client.query('hello', {
        username: 'test',
      }),
    ).toMatchInlineSnapshot(`
          Object {
            "text": "hello test",
          }
      `);
  });
});
