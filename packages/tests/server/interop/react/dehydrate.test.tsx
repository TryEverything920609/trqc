/* eslint-disable @typescript-eslint/no-empty-function */
import { createLegacyAppRouter } from './__testHelpers';
import '@testing-library/jest-dom';
import { createSSGHelpers } from '@trpc/react-query/src/ssg';

let factory: ReturnType<typeof createLegacyAppRouter>;
beforeEach(() => {
  factory = createLegacyAppRouter();
});
afterEach(() => {
  factory.close();
});

test('dehydrate', async () => {
  const { db, appRouter } = factory;
  const ssg = createSSGHelpers({ router: appRouter, ctx: {} });

  await ssg.prefetchQuery('allPosts');
  await ssg.fetchQuery('postById', '1');

  const dehydrated = ssg.dehydrate().queries;
  expect(dehydrated).toHaveLength(2);

  const [cache, cache2] = dehydrated;
  expect(cache!.queryHash).toMatchInlineSnapshot(
    `"[[\\"allPosts\\"],{\\"type\\":\\"query\\"}]"`,
  );
  expect(cache!.queryKey).toMatchInlineSnapshot(`
    Array [
      Array [
        "allPosts",
      ],
      Object {
        "type": "query",
      },
    ]
  `);
  expect(cache!.state.data).toEqual(db.posts);
  expect(cache2!.state.data).toMatchInlineSnapshot(`
    Object {
      "createdAt": 0,
      "id": "1",
      "title": "first post",
    }
  `);
});
