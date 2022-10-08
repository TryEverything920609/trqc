import { routerToServerAndClientNew, waitError } from './___testHelpers';
import { TRPCClientError } from '@trpc/client/src';
import { konn } from 'konn';
import { initTRPC } from '../src';

const createTestContext = (opts: { isDev: boolean }) =>
  konn()
    .beforeEach(() => {
      const t = initTRPC.create({ isDev: opts.isDev });

      const appRouter = t.router({
        failingMutation: t.procedure.mutation(() => {
          if (Math.random() < 2) {
            throw new Error('Always fails');
          }
          return 'hello';
        }),
      });

      const res = routerToServerAndClientNew(appRouter);

      return res;
    })
    .afterEach(async (ctx) => {
      await ctx?.close?.();
    })
    .done();

describe('isDev:true', () => {
  const ctx = createTestContext({ isDev: true });

  test('prints stacks', async () => {
    const error = (await waitError(
      () => ctx.proxy.failingMutation.mutate(),
      TRPCClientError,
    )) as TRPCClientError<typeof ctx.router>;

    expect(error.data?.stack?.split('\n')[0]).toMatchInlineSnapshot(
      `"Error: Always fails"`,
    );
  });
});

describe('isDev:false', () => {
  const ctx = createTestContext({ isDev: false });

  test('does not print stack', async () => {
    const error = (await waitError(
      () => ctx.proxy.failingMutation.mutate(),
      TRPCClientError,
    )) as TRPCClientError<typeof ctx.router>;

    expect(error.data?.stack).toBeUndefined();
  });
});
