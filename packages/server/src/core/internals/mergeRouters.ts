import { defaultFormatter } from '../../error/formatter';
import { CombinedDataTransformer, defaultTransformer } from '../../transformer';
import { AnyRouter, createRouterFactory } from '../router';
import { mergeWithoutOverrides } from './mergeWithoutOverrides';

export function mergeRouters(...routerList: AnyRouter[]): AnyRouter {
  const queries = mergeWithoutOverrides(
    {},
    ...routerList.map((r) => r.queries),
  );
  const mutations = mergeWithoutOverrides(
    {},
    ...routerList.map((r) => r.mutations),
  );
  const subscriptions = mergeWithoutOverrides(
    {},
    ...routerList.map((r) => r.subscriptions),
  );
  const errorFormatter = routerList.reduce(
    (currentErrorFormatter, nextRouter) => {
      if (
        nextRouter.errorFormatter &&
        nextRouter.errorFormatter !== defaultFormatter
      ) {
        if (
          currentErrorFormatter !== defaultFormatter &&
          currentErrorFormatter !== nextRouter.errorFormatter
        ) {
          throw new Error('You seem to have several error formatters');
        }
        return nextRouter.errorFormatter;
      }
      return currentErrorFormatter;
    },
    defaultFormatter,
  );

  const transformer = routerList.reduce((prev, current) => {
    if (current.transformer && current.transformer !== defaultTransformer) {
      if (prev !== defaultTransformer && prev !== current.transformer) {
        throw new Error('You seem to have several transformers');
      }
      return current.transformer;
    }
    return prev;
  }, defaultTransformer as CombinedDataTransformer);

  const router = createRouterFactory({
    errorFormatter,
    transformer,
  })({
    queries,
    mutations,
    subscriptions,
  });
  return router;
}
