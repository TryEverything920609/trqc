/* eslint-disable @typescript-eslint/no-empty-function */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { routerToServerAndClient } from './__testHelpers';
import fetch from 'node-fetch';
import * as trpc from '../src';
import { CreateHTTPContextOptions } from '../src/adapters/standalone';

test('set custom headers in beforeEnd', async () => {
  const onError = jest.fn();
  const { close, httpUrl } = routerToServerAndClient(
    trpc
      .router<CreateHTTPContextOptions>()
      .query('public.q', {
        resolve() {
          return 'public endpoint';
        },
      })
      .query('nonCachedEndpoint', {
        resolve() {
          return 'not cached endpoint';
        },
      }),
    {
      server: {
        onError,
        responseMeta({ ctx, paths, type, errors }) {
          // assuming you have all your public routes with the kewyord `public` in them
          const allPublic =
            paths && paths.every((path) => path.includes('public'));
          // checking that no procedures errored
          const allOk = errors.length === 0;
          // checking we're doing a query request
          const isQuery = type === 'query';

          if (ctx?.res && allPublic && allOk && isQuery) {
            // cache request for 1 day + revalidate once every second
            const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
            return {
              headers: {
                'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
              },
            };
          }
          return {};
        },
      },
    },
  );
  {
    const res = await fetch(`${httpUrl}/public.q`);

    expect(await res.json()).toMatchInlineSnapshot(`
Object {
  "id": null,
  "result": Object {
    "data": "public endpoint",
    "type": "data",
  },
}
`);

    expect(res.headers.get('cache-control')).toMatchInlineSnapshot(
      `"s-maxage=1, stale-while-revalidate=86400"`,
    );
  }
  {
    const res = await fetch(`${httpUrl}/nonCachedEndpoint`);

    expect(await res.json()).toMatchInlineSnapshot(`
Object {
  "id": null,
  "result": Object {
    "data": "not cached endpoint",
    "type": "data",
  },
}
`);

    expect(res.headers.get('cache-control')).toBeNull();
  }

  close();
});
