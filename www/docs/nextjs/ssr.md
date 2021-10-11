---
id: ssr
title: Server-Side Rendering
sidebar_label: Server-Side Rendering (SSR)
slug: /ssr
---

> The only thing you need to do to get SSR on your application is to set `ssr: true` in your `_app.tsx`, but it comes with some additional considerations.

### Configure `_app.tsx` for SSR

Server-side rendering comes with additional considerations. In order to execute queries properly during the server-side render step and customize caching behavior, we might want to add some extra logic inside our `_app.tsx`:

```tsx
import React from 'react';
import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from './api/trpc/[trpc]';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    // during SSR rendering
    if (typeof window === 'undefined') {
      return {
        url: '/api/trpc',
      };
    }

    // optional: use SSG-caching for each rendered page (see caching section for more details)
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      'Cache-Control',
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
    );

    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/trpc`
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      headers: {
        // optional - inform server that it's an ssr request
        'x-ssr': '1',
      },
    };
  },
  ssr: true,
})(MyApp);
```
