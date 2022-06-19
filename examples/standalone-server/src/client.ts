/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTRPCClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import ws from 'ws';
import type { AppRouter } from './server';

// polyfill fetch & websocket
const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;
globalAny.WebSocket = ws;

const wsClient = createWSClient({
  url: `ws://localhost:2022`,
});
const client = createTRPCClient<AppRouter>({
  links: [
    // call subscriptions through websockets and the rest over http
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: `http://localhost:2022`,
      }),
    }),
  ],
});

async function main() {
  const helloResponse = await client.queries.greeting({
    name: 'world',
  });

  console.log('helloResponse', helloResponse);

  const createPostRes = await client.mutation('createPost', {
    title: 'hello world',
    text: 'check out https://tRPC.io',
  });
  console.log('createPostResponse', createPostRes);

  let count = 0;
  await new Promise<void>((resolve) => {
    const subscription = client.subscription('randomNumber', undefined, {
      next(data) {
        // ^ note that `data` here is inferred
        console.log('received', data);
        count++;
        if (count > 3) {
          // stop after 3 pulls
          subscription.unsubscribe();
          resolve();
        }
      },
      error(err) {
        console.error('error', err);
      },
    });
  });
  wsClient.close();
}

main();
