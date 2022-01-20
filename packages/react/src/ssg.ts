import {
  AnyRouter,
  assertNotBrowser,
  ClientDataTransformerOptions,
  inferHandlerInput,
  inferProcedureOutput,
  inferRouterContext,
} from '@trpc/server';
import { InfiniteData, QueryClient } from 'react-query';
import {
  dehydrate,
  DehydratedState,
  DehydrateOptions,
} from 'react-query/hydration';
type QueryClientConfig = ConstructorParameters<typeof QueryClient>[0];

assertNotBrowser();

export interface CreateSSGHelpersOptions<TRouter extends AnyRouter> {
  router: TRouter;
  ctx: inferRouterContext<TRouter>;
  transformer?: ClientDataTransformerOptions;
  queryClientConfig?: QueryClientConfig;
}

/**
 * Create functions you can use for server-side rendering / static generation
 */
export function createSSGHelpers<TRouter extends AnyRouter>({
  router,
  transformer,
  ctx,
  queryClientConfig,
}: CreateSSGHelpersOptions<TRouter>) {
  type TQueries = TRouter['_def']['queries'];
  const queryClient = new QueryClient(queryClientConfig);

  const serialize = transformer
    ? ('input' in transformer ? transformer.input : transformer).serialize
    : (obj: unknown) => obj;
  const caller = router.createCaller(ctx) as ReturnType<
    TRouter['createCaller']
  >;
  const prefetchQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ) => {
    return queryClient.prefetchQuery(pathAndInput, async () => {
      const data = await caller.query(...pathAndInput);

      return data;
    });
  };

  const prefetchInfiniteQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ) => {
    return queryClient.prefetchInfiniteQuery(pathAndInput, async () => {
      const data = await caller.query(...pathAndInput);

      return data;
    });
  };

  const fetchQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
    TOutput extends inferProcedureOutput<TProcedure>,
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ): Promise<TOutput> => {
    return queryClient.fetchQuery(pathAndInput, async () => {
      const data = await caller.query(...pathAndInput);

      return data;
    });
  };

  const fetchInfiniteQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
    TOutput extends inferProcedureOutput<TProcedure>,
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ): Promise<InfiniteData<TOutput>> => {
    return queryClient.fetchInfiniteQuery(pathAndInput, async () => {
      const data = await caller.query(...pathAndInput);

      return data;
    });
  };

  function _dehydrate(
    opts: DehydrateOptions = {
      shouldDehydrateQuery() {
        // makes sure to serialize errors
        return true;
      },
    },
  ): DehydratedState {
    const before = dehydrate(queryClient, opts);
    const after = serialize(before);
    return after;
  }

  return {
    prefetchQuery,
    prefetchInfiniteQuery,
    fetchQuery,
    fetchInfiniteQuery,
    dehydrate: _dehydrate,
    queryClient,
  };
}
