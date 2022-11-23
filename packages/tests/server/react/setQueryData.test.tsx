/* eslint-disable @typescript-eslint/no-empty-function */
import { createQueryClient } from '../__queryClient';
import { createAppRouter } from './__testHelpers';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React, { useState } from 'react';

let factory: ReturnType<typeof createAppRouter>;
beforeEach(() => {
  factory = createAppRouter();
});
afterEach(() => {
  factory.close();
});

describe('setQueryData()', () => {
  test('without & without callback', async () => {
    const { trpc, client } = factory;
    function MyComponent() {
      const utils = trpc.useContext();
      const allPostsQuery = trpc.allPosts.useQuery(undefined, {
        enabled: false,
      });
      const postByIdQuery = trpc.postById.useQuery('1', {
        enabled: false,
      });
      return (
        <>
          <pre>{JSON.stringify(allPostsQuery.data ?? null, null, 4)}</pre>
          <pre>{JSON.stringify(postByIdQuery.data ?? null, null, 4)}</pre>
          <button
            data-testid="setQueryData"
            onClick={async () => {
              utils.allPosts.setData(
                undefined,
                [
                  {
                    id: 'id',
                    title: 'allPost.title',
                    createdAt: Date.now(),
                  },
                ],
                undefined,
              );
              const newPost = {
                id: 'id',
                title: 'postById.tmp.title',
                createdAt: Date.now(),
              };
              utils.postById.setData('1', (data) => {
                expect(data).toBe(undefined);
                return newPost;
              });
              // now it should be set
              utils.postById.setData('1', (data) => {
                expect(data).toEqual(newPost);
                if (!data) {
                  return newPost;
                }
                return {
                  ...data,
                  title: 'postById.title',
                };
              });
            }}
          />
        </>
      );
    }
    function App() {
      const [queryClient] = useState(() => createQueryClient());
      return (
        <trpc.Provider {...{ queryClient, client }}>
          <QueryClientProvider client={queryClient}>
            <MyComponent />
          </QueryClientProvider>
        </trpc.Provider>
      );
    }

    const utils = render(<App />);

    utils.getByTestId('setQueryData').click();

    await waitFor(() => {
      expect(utils.container).toHaveTextContent('allPost.title');
      expect(utils.container).toHaveTextContent('postById.title');
    });
  });
});
