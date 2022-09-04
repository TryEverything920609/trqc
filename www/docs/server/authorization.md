---
id: authorization
title: Authorization
sidebar_label: Authorization
slug: /authorization
---

The `createContext`-function is called for each incoming request so here you can add contextual information about the calling user from the request object.

## Create context from request headers

```ts title='server/context.ts'
import * as trpc from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { decodeAndVerifyJwtToken } from './somewhere/in/your/app/utils';

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.split(' ')[1],
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
  };
}
type Context = inferAsyncReturnType<typeof createContext>;
```

## Option 1: Authorize using resolver

```ts title='server/routers/_app.ts'
import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from '../context';

export const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  // open for anyone
  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input, ctx }) => `hello ${input ?? ctx.user?.name ?? 'world'}`),
  // checked in resolver
  secret: t.procedure.query(({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return {
      secret: 'sauce',
    };
  }),
});
```

## Option 2: Authorize using middleware

```ts title='server/routers/_app.ts'
import { TRPCError, initTRPC } from '@trpc/server';

export const t = initTRPC.context<Context>().create();


const isAuthed = t.middleware(({ next, ctx }) => {
  if (!params.ctx.user?.isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: params.ctx.user,
    },
  });
});


// you can reuse this for any procedure
const protectedProcedure = t.procedure.use(isAuthed);

t.router({
  // this is accessible for everyone
  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input, ctx }) => `hello ${input ?? ctx.user?.name ?? 'world'}`),
  admin: t.router({
    // this is accessible only to admins
    secret: protectedProcedure.query(({ ctx }) => {
      return {
        secret: 'sauce',
      };
    }),
  }),
});
```
