---
id: header
title: Custom header
sidebar_label: Create Custom Header
slug: /header
---

The headers option can be customize in config when using `withTRPC` in nextjs or `createClient` in react.js.

`headers` can be both an object or a function. If it's a function it will gets called dynamically every http request.

```ts title='_app.tsx'
import { AppType } from "next/dist/shared/lib/utils";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "@/server/routers/app";

export let token: string;

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
      /** 
      * Headers will be called on each request.
      */
        headers() {
            return {
                Authorization: token
              }
          }
      }
  })(MyApp)
```

### Example with auth login

```ts title='pages/auth.tsx'
const loginMut = trpc.useMutation(['auth.login'], {
  onSuccess({ accessToken }) {
    token = accessToken;
  },
});
```

The `token` can be whatever you want it to be. It's entirely up to you whether that's just a client-side
variable that you update the value of on success or whether you store the token and pull it from local storage.
