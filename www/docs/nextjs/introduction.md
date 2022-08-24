---
id: introduction
title: Usage with Next.js
sidebar_label: Usage with Next.js
slug: /nextjs
---

:::tip
If you're using tRPC in a new project, consider using one of the example projects as a starting point or for reference: [tRPC Example Projects](/docs/example-apps)
:::

tRPC and Next.js are a match made in heaven! Next.js makes it easy for you to build your client and server together in one codebase. This makes it easy to share types between them.

tRPC includes dedicated tools to make the Next.js developer experience as seamless as possible.

## Recommended file structure

Recommended but not enforced file structure. This is what you get when starting from [the examples](../main/example-apps.md).

```graphql
.
├── prisma # <-- if prisma is added
│   └── [..]
├── src
│   ├── pages
│   │   ├── _app.tsx # <-- add `withTRPC()`-HOC here
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc].ts # <-- tRPC HTTP handler
│   │   └── [..]
│   ├── server
│   │   ├── routers
│   │   │   ├── app.ts   # <-- main app router
│   │   │   ├── post.ts  # <-- sub routers
│   │   │   └── [..]
│   │   ├── context.ts      # <-- create app context
│   │   └── createRouter.ts # <-- router helper
│   └── utils
│       └── trpc.ts  # <-- your typesafe tRPC hooks
└── [..]
```

## Add tRPC to existing Next.js project

### 1. Install deps

```bash
yarn add @trpc/client @trpc/server @trpc/react @trpc/next zod react-query@3
```

- React Query: `@trpc/react` provides a thin wrapper over [react-query](https://react-query.tanstack.com/overview). It is required as a peer dependency.
- Zod: most examples use [Zod](https://github.com/colinhacks/zod) for input validation and we highly recommended it, though it isn't required. You can use a validation library of your choice ([Yup](https://github.com/jquense/yup), [Superstruct](https://github.com/ianstormtaylor/superstruct), [io-ts](https://github.com/gcanti/io-ts), etc). In fact, any object containing a `parse`, `create` or `validateSync` method will work.

### 2. Enable strict mode

If you want to use Zod for input validation, make sure you have enabled strict mode in your `tsconfig.json`:

```json
// tsconfig.json
{
  // ...
  "compilerOptions": {
    // ...
    "strict": true
  }
}
```

If strict mode is too much, at least enable `strictNullChecks`:

```json
// tsconfig.json
{
  // ...
  "compilerOptions": {
    // ...
    "strictNullChecks": true
  }
}
```

### 3. Create a tRPC router

Implement your tRPC router in `./pages/api/trpc/[trpc].ts`. If you need to split your router into several subrouters, implement them in a top-level `server` directory in your project root, then import them into `./pages/api/trpc/[trpc].ts` and [merge them](/docs/merging-routers) into a single root `appRouter`.

<details><summary>View sample router</summary>

```ts title='./pages/api/trpc/[trpc].ts'
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
```

</details>

### 4. Create tRPC hooks

Create a set of strongly-typed hooks using your API's type signature.

```tsx title='utils/trpc.ts'
import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../pages/api/trpc/[trpc]';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
```

### 5. Configure `_app.tsx`

The `createReactQueryHooks` function expects certain parameters to be passed via the Context API. To set these parameters, create a custom `_app.tsx` using the `withTRPC` higher-order component:

```tsx title='pages/_app.tsx'
import { withTRPC } from '@trpc/next';
import type { AppProps } from 'next/app';
import { AppRouter } from './api/trpc/[trpc]';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      url: `${getBaseUrl()}/api/trpc`,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
```

### 6. Make API requests

```tsx title='pages/index.tsx'
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const hello = trpc.useQuery(['hello', { text: 'client' }]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
};
```

## `withTRPC()` options

### `config`-callback

The `config`-argument is a function that returns an object that configures the tRPC and React Query clients. This function has a `ctx` input that gives you access to the Next.js `req` object, among other things. The returned value can contain the following properties:

- Exactly **one of** these are **required**:

  - `url` your API URL.
  - `links` to customize the flow of data between tRPC Client and the tRPC-server. [Read more](../client/links.md).

- Optional:
  - `queryClientConfig`: a configuration object for the React Query `QueryClient` used internally by the tRPC React hooks: [QueryClient docs](https://react-query.tanstack.com/reference/QueryClient)
  - `headers`: an object or a function that returns an object of outgoing tRPC requests
  - `transformer`: a transformer applied to outgoing payloads. Read more about [Data Transformers](/docs/data-transformers)
  - `fetch`: customize the implementation of `fetch` used by tRPC internally
  - `AbortController`: customize the implementation of `AbortController` used by tRPC internally

### `ssr`-boolean (default: `false`)

Whether tRPC should await queries when server-side rendering a page. Defaults to `false`.

### `responseMeta`-callback

Ability to set request headers and HTTP status when server-side rendering.

#### Example

```tsx title='pages/_app.tsx'
export default withTRPC<AppRouter>({
  config({ ctx }) {
    /* [...] */
  },
  ssr: true,
  responseMeta({ clientErrors, ctx }) {
    if (clientErrors.length) {
      // propagate first http error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }
    // cache full page for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
})(MyApp);
```

## Next steps

Refer to the `@trpc/react` docs for additional information on executing [Queries](/docs/react-queries) and [Mutations](/docs/react-mutations) inside your components.
