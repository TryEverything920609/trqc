---
id: fastify
title: Usage with Fastify
sidebar_label: Fastify
slug: /fastify
---

## Example app

The best way to start with the Fastify adapter is to take a look at the example application.

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Links</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <ul>
          <li>Fastify server with WebSocket</li>
          <li>Simple TRPC client in node</li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="https://codesandbox.io/s/github/trpc/trpc/tree/main/examples/fastify-server">CodeSandbox</a></li>
          <li><a href="https://github.com/trpc/trpc/tree/main/examples/fastify-server">Source</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## How to use tRPC with Fastify

### Install dependencies

```bash
yarn add @trpc/server fastify zod
```

> [Zod](https://github.com/colinhacks/zod) isn't a required dependency, but it's used in the sample router below.

### Create the router

First of all you need a [router](router) to handle your queries, mutations and subscriptions.

A sample router is given below, save it in a file named `router.ts`.

<details>
  <summary>router.ts</summary>

```ts title='router.ts'
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

export const t = initTRPC.create();

export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query(({ input }) => {
    return users[input]; // input type is string
  }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation(({ input }) => {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
```

</details>

If your router file starts getting too big, split your router into several subrouters each implemented in its own file. Then [merge them](merging-routers) into a single root `appRouter`.

### Create the context

Then you need a [context](context) that will be created for each request.

A sample context is given below, save it in a file named `context.ts`:

<details>
  <summary>context.ts</summary>

```ts title='context.ts'
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };

  return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

</details>

### Create Fastify server

tRPC includes an adapter for [Fastify](https://www.fastify.io/) out of the box. This adapter lets you convert your tRPC router into a [Fastify plugin](https://www.fastify.io/docs/latest/Reference/Plugins/). In order to prevent errors during large batch requests, make sure to set the `maxParamLength` Fastify option to a suitable value, as shown.

```ts title='server.ts'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createContext } from './context';
import { appRouter } from './router';

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
```

Your endpoints are now available via HTTP!

| Endpoint     | HTTP URI                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `getUser`    | `GET http://localhost:3000/trpc/getUserById?input=INPUT` <br/><br/>where `INPUT` is a URI-encoded JSON string. |
| `createUser` | `POST http://localhost:3000/trpc/createUser` <br/><br/>with `req.body` of type `User`                          |

## How to enable subscriptions (WebSocket)

The Fastify adapter supports [subscriptions](subscriptions) via the [@fastify/websocket](https://www.npmjs.com/package/@fastify/websocket) plugin. All you have to do in addition to the above steps is install the dependency, add some subscriptions to your router and activate the `useWSS` [option](#fastify-plugin-options) in the plugin. The minimum Fastify version required for `@fastify/websocket` is `3.11.0`.

### Install dependencies

```bash
yarn add @fastify/websocket
```

### Import and register `@fastify/websocket`

```ts
import ws from '@fastify/websocket';

server.register(ws);
```

### Add some subscriptions

:::caution
Work in progress: https://github.com/trpc/trpc/issues/2114
:::

Edit the `router.ts` file created in the previous steps and add the following code:

```ts title='router.ts'
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';

const t = initTRPC.create();

export const appRouter = t.router({
  randomNumber: t.procedure.subscription(() => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        emit.next({ randomNumber: Math.random() });
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    });
  })
});
```

### Activate the `useWSS` option

```ts title='server.ts'
server.register(fastifyTRPCPlugin, {
  useWSS: true,
  // ...
});
```

It's alright, you can subscribe to the topic `randomNumber` and you should receive a random number every second 🚀.

## Fastify plugin options

| name        | type                     | optional | default   | description |
| ----------- | ------------------------ | -------- | --------- | ----------- |
| prefix      | `string`                 | `true`   | `"/trpc"` |             |
| useWSS      | `boolean`                | `true`   | `false`   |             |
| trpcOptions | `NodeHTTPHandlerOptions` | `false`  | `n/a`     |             |
