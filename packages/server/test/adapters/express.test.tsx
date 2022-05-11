/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, router } from './__router';
import AbortController from 'abort-controller';
import express from 'express';
import http from 'http';
import fetch from 'node-fetch';
import { createTRPCClient } from '../../../client/src';
import * as trpc from '../../src';
import * as trpcExpress from '../../src/adapters/express';

async function startServer() {
  const createContext = (
    _opts: trpcExpress.CreateExpressContextOptions,
  ): Context => {
    const getUser = () => {
      if (_opts.req.headers.authorization === 'meow') {
        return {
          name: 'KATT',
        };
      }
      return null;
    };

    return {
      user: getUser(),
    };
  };

  // express implementation
  const app = express();

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router,
      createContext,
    }),
  );
  const { server, port } = await new Promise<{
    server: http.Server;
    port: number;
  }>((resolve) => {
    const server = app.listen(0, () => {
      resolve({
        server,
        port: (server.address() as any).port,
      });
    });
  });

  const client = createTRPCClient<typeof router>({
    url: `http://localhost:${port}/trpc`,

    AbortController: AbortController as any,
    fetch: fetch as any,
  });

  return {
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => {
          err ? reject(err) : resolve();
        }),
      ),
    port,
    router,
    client,
  };
}

let t: trpc.inferAsyncReturnType<typeof startServer>;
beforeAll(async () => {
  t = await startServer();
});
afterAll(async () => {
  await t.close();
});

test('simple query', async () => {
  expect(
    await t.client.query('hello', {
      who: 'test',
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "text": "hello test",
    }
  `);

  expect(await t.client.query('hello')).toMatchInlineSnapshot(`
    Object {
      "text": "hello world",
    }
  `);
});
