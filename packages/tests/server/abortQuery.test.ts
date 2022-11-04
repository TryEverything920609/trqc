import { routerToServerAndClientNew, waitMs } from './___testHelpers';
import { initTRPC } from '@trpc/server/src/core';

const t = initTRPC.create();

const router = t.router({
  testQuery: t.procedure.query(async () => {
    await waitMs(1000);
    return 'hello';
  }),
  testMutation: t.procedure.mutation(async () => {
    await waitMs(1000);
    return 'hello';
  }),
});
type Router = typeof router;

describe('vanilla client procedure abortion', () => {
  test('query', async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const { close, proxy } = routerToServerAndClientNew<Router>(router);

    const promise = proxy.testQuery.query(undefined, { signal });
    abortController.abort();

    expect(promise).rejects.toThrowError(/aborted/);
    close();
  });

  test('mutation', async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const { close, proxy } = routerToServerAndClientNew<Router>(router);

    const promise = proxy.testMutation.mutate(undefined, { signal });
    abortController.abort();

    expect(promise).rejects.toThrowError(/aborted/);
    close();
  });
});
