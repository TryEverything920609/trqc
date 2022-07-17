/* eslint-disable @typescript-eslint/no-empty-function */
import { Post, createLegacyAppRouter } from './__testHelpers';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectTypeOf } from 'expect-type';
import React, { Fragment, useState } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { createSSGHelpers } from '../../../../react/src/ssg';

setLogger({
  log() {},
  warn() {},
  error() {},
});

let factory: ReturnType<typeof createLegacyAppRouter>;
beforeEach(() => {
  factory = createLegacyAppRouter();
});
afterEach(() => {
  factory.close();
});

describe('Infinite Query', () => {
  test('useInfiniteQuery()', async () => {
    const { trpc, client } = factory;

    function MyComponent() {
      const q = trpc.useInfiniteQuery(
        [
          'paginatedPosts',
          {
            limit: 1,
          },
        ],
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      );
      expectTypeOf(q.data?.pages[0]!.items).toMatchTypeOf<undefined | Post[]>();

      return q.status === 'loading' ? (
        <p>Loading...</p>
      ) : q.status === 'error' ? (
        <p>Error: {q.error.message}</p>
      ) : (
        <>
          {q.data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((msg) => (
                <Fragment key={msg.id}>
                  <div>{msg.title}</div>
                </Fragment>
              ))}
            </Fragment>
          ))}
          <div>
            <button
              onClick={() => q.fetchNextPage()}
              disabled={!q.hasNextPage || q.isFetchingNextPage}
              data-testid="loadMore"
            >
              {q.isFetchingNextPage
                ? 'Loading more...'
                : q.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
          <div>
            {q.isFetching && !q.isFetchingNextPage ? 'Fetching...' : null}
          </div>
        </>
      );
    }
    function App() {
      const [queryClient] = useState(() => new QueryClient());
      return (
        <trpc.Provider {...{ queryClient, client }}>
          <QueryClientProvider client={queryClient}>
            <MyComponent />
          </QueryClientProvider>
        </trpc.Provider>
      );
    }

    const utils = render(<App />);
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).not.toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Load More');
    });
    userEvent.click(utils.getByTestId('loadMore'));
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('Loading more...');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Nothing more to load');
    });

    expect(utils.container).toMatchInlineSnapshot(`
    <div>
      <div>
        first post
      </div>
      <div>
        second post
      </div>
      <div>
        <button
          data-testid="loadMore"
          disabled=""
        >
          Nothing more to load
        </button>
      </div>
      <div />
    </div>
  `);
  });

  test('useInfiniteQuery and prefetchInfiniteQuery', async () => {
    const { trpc, client } = factory;

    function MyComponent() {
      const trpcContext = trpc.useContext();
      const q = trpc.useInfiniteQuery(
        [
          'paginatedPosts',
          {
            limit: 1,
          },
        ],
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      );
      expectTypeOf(q.data?.pages[0]?.items).toMatchTypeOf<undefined | Post[]>();

      return q.status === 'loading' ? (
        <p>Loading...</p>
      ) : q.status === 'error' ? (
        <p>Error: {q.error.message}</p>
      ) : (
        <>
          {q.data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((msg) => (
                <Fragment key={msg.id}>
                  <div>{msg.title}</div>
                </Fragment>
              ))}
            </Fragment>
          ))}
          <div>
            <button
              onClick={() => q.fetchNextPage()}
              disabled={!q.hasNextPage || q.isFetchingNextPage}
              data-testid="loadMore"
            >
              {q.isFetchingNextPage
                ? 'Loading more...'
                : q.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
          <div>
            <button
              data-testid="prefetch"
              onClick={() =>
                trpcContext.prefetchInfiniteQuery([
                  'paginatedPosts',
                  { limit: 1 },
                ])
              }
            >
              Prefetch
            </button>
          </div>
          <div>
            {q.isFetching && !q.isFetchingNextPage ? 'Fetching...' : null}
          </div>
        </>
      );
    }
    function App() {
      const [queryClient] = useState(() => new QueryClient());
      return (
        <trpc.Provider {...{ queryClient, client }}>
          <QueryClientProvider client={queryClient}>
            <MyComponent />
          </QueryClientProvider>
        </trpc.Provider>
      );
    }

    const utils = render(<App />);
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).not.toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Load More');
    });
    userEvent.click(utils.getByTestId('loadMore'));
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('Loading more...');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Nothing more to load');
    });

    expect(utils.container).toMatchInlineSnapshot(`
    <div>
      <div>
        first post
      </div>
      <div>
        second post
      </div>
      <div>
        <button
          data-testid="loadMore"
          disabled=""
        >
          Nothing more to load
        </button>
      </div>
      <div>
        <button
          data-testid="prefetch"
        >
          Prefetch
        </button>
      </div>
      <div />
    </div>
  `);

    userEvent.click(utils.getByTestId('prefetch'));
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('Fetching...');
    });
    await waitFor(() => {
      expect(utils.container).not.toHaveTextContent('Fetching...');
    });

    // It should correctly fetch both pages
    expect(utils.container).toHaveTextContent('first post');
    expect(utils.container).toHaveTextContent('second post');
  });

  test('useInfiniteQuery and fetchInfiniteQuery', async () => {
    const { trpc, client } = factory;

    function MyComponent() {
      const trpcContext = trpc.useContext();
      const q = trpc.useInfiniteQuery(
        [
          'paginatedPosts',
          {
            limit: 1,
          },
        ],
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      );
      expectTypeOf(q.data?.pages[0]?.items).toMatchTypeOf<undefined | Post[]>();

      return q.status === 'loading' ? (
        <p>Loading...</p>
      ) : q.status === 'error' ? (
        <p>Error: {q.error.message}</p>
      ) : (
        <>
          {q.data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((msg) => (
                <Fragment key={msg.id}>
                  <div>{msg.title}</div>
                </Fragment>
              ))}
            </Fragment>
          ))}
          <div>
            <button
              onClick={() => q.fetchNextPage()}
              disabled={!q.hasNextPage || q.isFetchingNextPage}
              data-testid="loadMore"
            >
              {q.isFetchingNextPage
                ? 'Loading more...'
                : q.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
          <div>
            <button
              data-testid="fetch"
              onClick={() =>
                trpcContext.fetchInfiniteQuery(['paginatedPosts', { limit: 1 }])
              }
            >
              Fetch
            </button>
          </div>
          <div>
            {q.isFetching && !q.isFetchingNextPage ? 'Fetching...' : null}
          </div>
        </>
      );
    }
    function App() {
      const [queryClient] = useState(() => new QueryClient());
      return (
        <trpc.Provider {...{ queryClient, client }}>
          <QueryClientProvider client={queryClient}>
            <MyComponent />
          </QueryClientProvider>
        </trpc.Provider>
      );
    }

    const utils = render(<App />);
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).not.toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Load More');
    });
    userEvent.click(utils.getByTestId('loadMore'));
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('Loading more...');
    });
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('first post');
      expect(utils.container).toHaveTextContent('second post');
      expect(utils.container).toHaveTextContent('Nothing more to load');
    });

    expect(utils.container).toMatchInlineSnapshot(`
    <div>
      <div>
        first post
      </div>
      <div>
        second post
      </div>
      <div>
        <button
          data-testid="loadMore"
          disabled=""
        >
          Nothing more to load
        </button>
      </div>
      <div>
        <button
          data-testid="fetch"
        >
          Fetch
        </button>
      </div>
      <div />
    </div>
  `);

    userEvent.click(utils.getByTestId('fetch'));
    await waitFor(() => {
      expect(utils.container).toHaveTextContent('Fetching...');
    });
    await waitFor(() => {
      expect(utils.container).not.toHaveTextContent('Fetching...');
    });

    // It should correctly fetch both pages
    expect(utils.container).toHaveTextContent('first post');
    expect(utils.container).toHaveTextContent('second post');
  });

  test('prefetchInfiniteQuery()', async () => {
    const { appRouter } = factory;
    const ssg = createSSGHelpers({ router: appRouter, ctx: {} });

    {
      await ssg.prefetchInfiniteQuery('paginatedPosts', { limit: 1 });
      const data = JSON.stringify(ssg.dehydrate());
      expect(data).toContain('first post');
      expect(data).not.toContain('second post');
    }
    {
      await ssg.fetchInfiniteQuery('paginatedPosts', { limit: 2 });
      const data = JSON.stringify(ssg.dehydrate());
      expect(data).toContain('first post');
      expect(data).toContain('second post');
    }
  });
});
