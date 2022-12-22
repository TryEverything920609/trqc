---
id: context
title: Context
sidebar_label: Context
slug: /context
---

Your context holds data that all of your tRPC procedures will have access to, and is a great place to put things like database connections or authentication information.

The `createContext()` function is called for each call to a procedure, which either comes via HTTP or from a [server-side call](server-side-calls)/[SSG helper](ssg-helpers).

The result is propagated to all resolvers.

## Example code

```tsx twoslash
// -------------------------------------------------
// @filename: context.ts
// -------------------------------------------------
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession({ req: opts.req });
  
  return {
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

// -------------------------------------------------
// @filename: trpc.ts
// -------------------------------------------------
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);
```

## Inner and outer context

In some scenarios it could make sense to split up your context into "inner" and "outer" functions.

**Inner context** is where you define context which doesn’t depend on the request, e.g. your database connection. You can use this function for integration testing or [SSG helpers](ssg-helpers), where you don’t have a request object. Whatever is defined here will **always** be available in your procedures.

**Outer context** is where you define context which depends on the request, e.g. for the user's session. Whatever is defined here is only available for procedures that are called via HTTP.

### Example for inner & outer context

```ts
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSessionFromCookie, type Session } from "./auth"

/** 
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null
}

/** 
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 * 
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createSSGHelpers` where we don't have `req`/`res`
 * 
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    prisma,
    session: opts.session,
  }
};

/** 
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 * 
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const session = getSessionFromCookie(req)

  const contextInner = await createContextInner({ session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  }
};

export type Context = inferAsyncReturnType<typeof createContextInner>;

// The usage in your router is the same as the example above.
```

It is important to infer your `Context` from the **inner** context, as only what is defined there is really always available in your procedures.

If you don't want to check `req` or `res` for `undefined` in your procedures all the time, you could build a small reusable procedure for that:

```ts
export const apiProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.req || !opts.ctx.res) {
    throw new Error("You are missing `req` or `res` in your call.");
  }
  return opts.next({
    ctx: {
      // We overwrite the context with the truthy `req` & `res`, which will also overwrite the types used in your procedure.
      req: opts.ctx.req,
      res: opts.ctx.res,
    },
  });
});
```
