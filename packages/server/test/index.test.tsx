/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { expectTypeOf } from 'expect-type';
import { createTRPCClient } from '../../client/src';
import { createWSClient, wsLink } from '../../client/src/links/wsLink';
import { z } from 'zod';
import { TRPCClientError } from '../../client/src';
import * as trpc from '../src';
import { CreateHttpContextOptions, Maybe } from '../src';
import { routerToServerAndClient } from './_testHelpers';
import WebSocket from 'ws';
import { waitFor } from '@testing-library/react';
import { httpBatchLink } from '../../client/src/links/httpBatchLink';
test('mix query and mutation', async () => {
  type Context = {};
  const r = trpc
    .router<Context>()
    .query('q1', {
      // input: null,
      resolve() {
        return 'q1res';
      },
    })
    .query('q2', {
      input: z.object({ q2: z.string() }),
      resolve() {
        return 'q2res';
      },
    })
    .mutation('m1', {
      resolve() {
        return 'm1res';
      },
    });

  const caller = r.createCaller({});
  expect(await caller.query('q1')).toMatchInlineSnapshot(`"q1res"`);

  expect(await caller.query('q2', { q2: 'hey' })).toMatchInlineSnapshot(
    `"q2res"`,
  );

  expect(await caller.mutation('m1')).toMatchInlineSnapshot(`"m1res"`);
});

test('merge', async () => {
  type Context = {};
  const root = trpc.router<Context>().query('helloo', {
    // input: null,
    resolve() {
      return 'world';
    },
  });
  const posts = trpc
    .router<Context>()
    .query('list', {
      resolve: () => [{ text: 'initial' }],
    })
    .mutation('create', {
      input: z.string(),
      resolve({ input }) {
        return { text: input };
      },
    });

  const r = root.merge('posts.', posts);
  const caller = r.createCaller({});
  expect(await caller.query('posts.list')).toMatchInlineSnapshot(`
    Array [
      Object {
        "text": "initial",
      },
    ]
  `);
});

describe('integration tests', () => {
  test('not found procedure', async () => {
    const { client, close } = routerToServerAndClient(
      trpc.router().query('hello', {
        input: z
          .object({
            who: z.string(),
          })
          .nullish(),
        resolve({ input }) {
          return {
            text: `hello ${input?.who ?? 'world'}`,
          };
        },
      }),
    );
    try {
      await client.query('notFound' as any);
      throw new Error('Did not fail');
    } catch (err) {
      if (!(err instanceof TRPCClientError)) {
        throw new Error('Not TRPCClientError');
      }
      expect(err.message).toMatchInlineSnapshot(
        `"No \\"query\\"-procedure on path \\"notFound\\""`,
      );
      expect(err.shape?.message).toMatchInlineSnapshot(
        `"No \\"query\\"-procedure on path \\"notFound\\""`,
      );
    }
    close();
  });

  test('invalid input', async () => {
    const { client, close } = routerToServerAndClient(
      trpc.router().query('hello', {
        input: z
          .object({
            who: z.string(),
          })
          .nullish(),
        resolve({ input }) {
          expectTypeOf(input).toMatchTypeOf<Maybe<{ who: string }>>();
          return {
            text: `hello ${input?.who ?? 'world'}`,
          };
        },
      }),
    );
    try {
      await client.query('hello', { who: 123 as any });
      throw new Error('Did not fail');
    } catch (err) {
      if (!(err instanceof TRPCClientError)) {
        throw new Error('Not TRPCClientError');
      }
      expect(err.shape?.code).toMatchInlineSnapshot(`-32600`);
      expect(err.shape?.message).toMatchInlineSnapshot(`
        "[
          {
            \\"code\\": \\"invalid_type\\",
            \\"expected\\": \\"string\\",
            \\"received\\": \\"number\\",
            \\"path\\": [
              \\"who\\"
            ],
            \\"message\\": \\"Expected string, received number\\"
          }
        ]"
      `);
    }
    close();
  });

  test('passing input to input w/o input', async () => {
    const { client, close } = routerToServerAndClient(
      trpc
        .router()
        .query('q', {
          resolve() {
            return {
              text: `hello `,
            };
          },
        })
        .mutation('m', {
          resolve() {
            return {
              text: `hello `,
            };
          },
        }),
    );

    await client.query('q');
    await client.query('q', undefined);
    await client.query('q', null as any); // treat null as undefined
    await expect(
      client.query('q', 'not-nullish' as any),
    ).rejects.toMatchInlineSnapshot(`[TRPCClientError: No input expected]`);

    await client.mutation('m');
    await client.mutation('m', undefined);
    await client.mutation('m', null as any); // treat null as undefined
    await expect(
      client.mutation('m', 'not-nullish' as any),
    ).rejects.toMatchInlineSnapshot(`[TRPCClientError: No input expected]`);

    close();
  });

  describe('type testing', () => {
    test('basic', async () => {
      type Input = { who: string };
      const { client, close } = routerToServerAndClient(
        trpc.router().query('hello', {
          input: z.object({
            who: z.string(),
          }),
          resolve({ input }) {
            expectTypeOf(input).not.toBeAny();
            expectTypeOf(input).toMatchTypeOf<{ who: string }>();

            return {
              text: `hello ${input?.who ?? 'world'}`,
              input,
            };
          },
        }),
      );
      const res = await client.query('hello', { who: 'katt' });
      expectTypeOf(res.input).toMatchTypeOf<Input>();
      expectTypeOf(res.input).not.toBeAny();
      expectTypeOf(res).toMatchTypeOf<{ input: Input; text: string }>();

      expect(res.text).toEqual('hello katt');

      close();
    });

    test('mixed response', async () => {
      const { client, close } = routerToServerAndClient(
        trpc.router().query('postById', {
          input: z.number(),
          async resolve({ input }) {
            if (input === 1) {
              return {
                id: 1,
                title: 'helloo',
              };
            }
            if (input === 2) {
              return {
                id: 2,
                title: 'test',
              };
            }
            return null;
          },
        }),
      );
      const res = await client.query('postById', 1);
      expectTypeOf(res).toMatchTypeOf<null | { id: number; title: string }>();
      expect(res).toEqual({
        id: 1,
        title: 'helloo',
      });

      close();
    });

    test('propagate ctx', async () => {
      type Context = {
        user?: {
          id: number;
          name: string;
        };
      };
      // eslint-disable-next-line prefer-const
      let headers: Record<string, string | undefined> = {};
      function createContext({ req }: CreateHttpContextOptions): Context {
        if (req.headers.authorization !== 'kattsecret') {
          return {};
        }
        return {
          user: {
            id: 1,
            name: 'KATT',
          },
        };
      }
      const { client, close } = routerToServerAndClient(
        trpc.router<Context>().query('whoami', {
          async resolve({ ctx }) {
            if (!ctx.user) {
              throw trpc.httpError.unauthorized();
            }
            return ctx.user;
          },
        }),
        {
          server: {
            createContext,
          },
          client: {
            headers: () => headers,
          },
        },
      );

      // no auth, should fail
      {
        let threw = false;
        try {
          const res = await client.query('whoami');
          expectTypeOf(res).toMatchTypeOf<{ id: number; name: string }>();
        } catch (err) {
          threw = true;
          expect(err.shape.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
        }
        if (!threw) {
          throw new Error("Didn't throw");
        }
      }
      // auth, should work
      {
        headers.authorization = 'kattsecret';
        const res = await client.query('whoami');
        expectTypeOf(res).toMatchTypeOf<{ id: number; name: string }>();
        expect(res).toEqual({
          id: 1,
          name: 'KATT',
        });
      }

      close();
    });

    test('optional input', async () => {
      type Input = Maybe<{ who: string }>;
      const { client, close } = routerToServerAndClient(
        trpc.router().query('hello', {
          input: z
            .object({
              who: z.string(),
            })
            .nullish(),
          resolve({ input }) {
            expectTypeOf(input).not.toBeAny();
            expectTypeOf(input).toMatchTypeOf<Input>();

            return {
              text: `hello ${input?.who ?? 'world'}`,
              input,
            };
          },
        }),
      );
      {
        const res = await client.query('hello', { who: 'katt' });
        expectTypeOf(res.input).toMatchTypeOf<Input>();
        expectTypeOf(res.input).not.toBeAny();
        expectTypeOf(res).toMatchTypeOf<{ input: Input; text: string }>();
      }
      {
        const res = await client.query('hello');
        expectTypeOf(res.input).toMatchTypeOf<Input>();
        expectTypeOf(res.input).not.toBeAny();
        expectTypeOf(res).toMatchTypeOf<{ input: Input; text: string }>();
      }

      close();
    });

    test('mutation', async () => {
      type Input = Maybe<{ who: string }>;
      const { client, close } = routerToServerAndClient(
        trpc.router().mutation('hello', {
          input: z
            .object({
              who: z.string(),
            })
            .nullish(),
          resolve({ input }) {
            expectTypeOf(input).not.toBeAny();
            expectTypeOf(input).toMatchTypeOf<Input>();

            return {
              text: `hello ${input?.who ?? 'world'}`,
              input,
            };
          },
        }),
      );
      const res = await client.mutation('hello', { who: 'katt' });
      expectTypeOf(res.input).toMatchTypeOf<Input>();
      expectTypeOf(res.input).not.toBeAny();
      expectTypeOf(res).toMatchTypeOf<{ input: Input; text: string }>();
      expect(res.text).toBe('hello katt');
      close();
    });
  });
});

describe('createCaller()', () => {
  type Context = {};
  const router = trpc
    .router<Context>()
    .query('q', {
      input: z.number(),
      async resolve({ input }) {
        return { input };
      },
    })
    .mutation('m', {
      input: z.number(),
      async resolve({ input }) {
        return { input };
      },
    })
    .subscription('sub', {
      input: z.number(),
      async resolve({ input }) {
        return new trpc.Subscription<{ input: typeof input }>((emit) => {
          emit.data({ input });
          return () => {
            // noop
          };
        });
      },
    });

  test('query()', async () => {
    const data = await router.createCaller({}).query('q', 1);
    expectTypeOf(data).toMatchTypeOf<{ input: number }>();
    expect(data).toEqual({ input: 1 });
  });
  test('mutation()', async () => {
    const data = await router.createCaller({}).mutation('m', 2);
    expectTypeOf(data).toMatchTypeOf<{ input: number }>();
    expect(data).toEqual({ input: 2 });
  });
  test('subscription()', async () => {
    const sub = await router.createCaller({}).subscription('sub', 3);

    await new Promise<void>((resolve) => {
      sub.on('data', (data: { input: number }) => {
        expect(data).toEqual({ input: 3 });
        expectTypeOf(data).toMatchTypeOf<{ input: number }>();
        resolve();
      });
      sub.start();
    });
  });
});

describe('createCaller()', () => {
  type Context = {};
  const router = trpc
    .router<Context>()
    .query('q', {
      input: z.number(),
      async resolve({ input }) {
        return { input };
      },
    })
    .mutation('m', {
      input: z.number(),
      async resolve({ input }) {
        return { input };
      },
    })
    .subscription('sub', {
      input: z.number(),
      async resolve({ input }) {
        return new trpc.Subscription<{ input: typeof input }>((emit) => {
          emit.data({ input });
          return () => {
            // noop
          };
        });
      },
    });

  test('query()', async () => {
    const data = await router.createCaller({}).query('q', 1);
    expectTypeOf(data).toMatchTypeOf<{ input: number }>();
    expect(data).toEqual({ input: 1 });
  });
  test('mutation()', async () => {
    const data = await router.createCaller({}).mutation('m', 2);
    expectTypeOf(data).toMatchTypeOf<{ input: number }>();
    expect(data).toEqual({ input: 2 });
  });
  test('subscription()', async () => {
    const sub = await router.createCaller({}).subscription('sub', 3);
    await new Promise<void>((resolve) => {
      sub.on('data', (data: { input: number }) => {
        expect(data).toEqual({ input: 3 });
        expectTypeOf(data).toMatchTypeOf<{ input: number }>();
        resolve();
      });
      sub.start();
    });
  });
});

// regression https://github.com/trpc/trpc/issues/527
test('void mutation response', async () => {
  const { client, close, wssPort, router } = routerToServerAndClient(
    trpc
      .router()
      .mutation('undefined', {
        async resolve() {},
      })
      .mutation('null', {
        async resolve() {
          return null;
        },
      }),
  );
  expect(await client.mutation('undefined')).toMatchInlineSnapshot(`undefined`);
  expect(await client.mutation('null')).toMatchInlineSnapshot(`null`);

  const ws = createWSClient({
    url: `ws://localhost:${wssPort}`,
    WebSocket: WebSocket as any,
  });
  const wsClient = createTRPCClient<typeof router>({
    links: [wsLink({ client: ws })],
  });

  expect(await wsClient.mutation('undefined')).toMatchInlineSnapshot(
    `undefined`,
  );
  expect(await wsClient.mutation('null')).toMatchInlineSnapshot(`null`);
  ws.close();
  close();
});

// https://github.com/trpc/trpc/issues/559
describe('TRPCAbortError', () => {
  test('cancelling request should throw TRPCAbortError', async () => {
    const { client, close } = routerToServerAndClient(
      trpc.router().query('slow', {
        async resolve() {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return null;
        },
      }),
    );
    const onReject = jest.fn();
    const req = client.query('slow');
    req.catch(onReject);
    // cancel after 10ms
    await new Promise((resolve) => setTimeout(resolve, 5));
    req.cancel();

    await waitFor(() => {
      expect(onReject).toHaveBeenCalledTimes(1);
    });

    const err = onReject.mock.calls[0][0] as TRPCClientError<any>;

    expect(err.name).toBe('TRPCClientError');
    expect(err.originalError?.name).toBe('TRPCAbortError');

    close();
  });

  test('cancelling batch request should throw AbortError', async () => {
    // aborting _one_ batch request doesn't necessarily mean we cancel the reqs part of that batch

    const { client, close } = routerToServerAndClient(
      trpc
        .router()
        .query('slow1', {
          async resolve() {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return 'slow1';
          },
        })
        .query('slow2', {
          async resolve() {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return 'slow2';
          },
        }),
      {
        server: {
          batching: {
            enabled: true,
          },
        },
        client({ httpUrl }) {
          return {
            links: [httpBatchLink({ url: httpUrl })],
          };
        },
      },
    );
    const req1 = client.query('slow1');
    const req2 = client.query('slow2');
    const onReject1 = jest.fn();
    req1.catch(onReject1);

    await new Promise((resolve) => setTimeout(resolve, 5));
    req1.cancel();
    await waitFor(() => {
      expect(onReject1).toHaveBeenCalledTimes(1);
    });

    const err = onReject1.mock.calls[0][0] as TRPCClientError<any>;
    expect(err.originalError?.name).toBe('TRPCAbortError');

    expect(await req2).toBe('slow2');

    close();
  });
});

test('regression: JSON.stringify([undefined]) gives [null] causes wrong type to procedure input', async () => {
  const { client, close } = routerToServerAndClient(
    trpc.router().query('q', {
      input: z.string().optional(),
      async resolve({ input }) {
        return { input };
      },
    }),
    {
      client({ httpUrl }) {
        return {
          links: [httpBatchLink({ url: httpUrl })],
        };
      },
      server: {
        batching: {
          enabled: true,
        },
      },
    },
  );

  expect(await client.query('q', 'foo')).toMatchInlineSnapshot(`
Object {
  "input": "foo",
}
`);
  expect(await client.query('q')).toMatchInlineSnapshot(`Object {}`);
  close();
});
