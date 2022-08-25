---
id: data-transformers
title: Data Transformers
sidebar_label: Data Transformers
slug: /data-transformers
---

You are able to serialize the response data & input args. The transformers need to be added both to the server and the client.

## Using [superjson](https://github.com/blitz-js/superjson)

SuperJSON allows us to transparently use e.g. standard `Date`/`Map`/`Set`s over the wire between the server and client. That means you can return any of these types in your API-resolver and use them in the client without recreating the objects from JSON.

### How to

#### 1. Install

```bash
yarn add superjson
```

#### 2. Add to your `initTRPC`

```ts title='routers/router/_app.ts'
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const t = initTRPC()({
  transformer: superjson,
});
```

#### 3. Add to `createTRPCProxyClient()` or `setupTRPC()`

```ts
import { createTRPCProxyClient } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '~/server/routers/_app';

export const client = createTRPCProxyClient<AppRouter>({
  transformer: superjson, // <--
  // [...]
});
```

```ts title='utils/trpc.ts'
import { setupTRPC } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '~/server/routers/_app';

// [...]

export const trpc = setupTRPC<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson, // <--
    };
  },
  // [...]
});
```

## Different transformers for upload and download

If a transformer should only be used for one directon or different transformers should be used for upload and download (e.g. for performance reasons), you can provide individual transformers for upload and download. Make sure you use the same combined transformer everywhere.

### How to

Here [superjson](https://github.com/blitz-js/superjson) is used for uploading and [devalue](https://github.com/Rich-Harris/devalue) for downloading data, because devalue is a lot faster but insecure to use on the server.

#### 1. Install

```bash
yarn add superjson devalue
```

#### 2. Add to `utils/trpc.ts`

```ts title='utils/trpc.ts'
import devalue from 'devalue';
import superjson from 'superjson';

// [...]

export const transformer = {
  input: superjson,
  output: {
    serialize: (object) => devalue(object),
    deserialize: (object) => eval(`(${object})`),
  },
};
```

#### 3. Add to your `AppRouter`

```ts title='server/routers/_app.ts'
import { initTRPC } from '@trpc/server';
import { transformer } from '../../utils/trpc';

export const t = initTRPC()({
  transformer,
});

export const appRouter = t.router({
  // [...]
});
```

#### 4. Add to `createTRPCProxyClient()`

```ts title='client.ts'
import { createTRPCProxyClient } from '@trpc/client';
import { transformer } from '../utils/trpc';

export const client = createTRPCProxyClient<AppRouter>({
  transformer, // <--
  // [...]
});
```

## `DataTransformer` interface

```ts
type DataTransformer = {
  serialize(object: any): any;
  deserialize(object: any): any;
};

type CombinedDataTransformer = {
  input: DataTransformer;
  output: DataTransformer;
};
```
