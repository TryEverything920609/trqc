import { expectTypeOf } from 'expect-type';
import { z } from 'zod';
import * as trpc from '../src';
import { inferProcedureInput, inferProcedureOutput } from '../src';

test('infer query input & output', async () => {
  const router = trpc
    .router()
    .query('noInput', {
      async resolve({ input }) {
        return { input };
      },
    })
    .query('withInput', {
      input: z.string(),
      output: z.object({
        input: z.string(),
      }),
      async resolve({ input }) {
        return { input };
      },
    })
    .query('withOutput', {
      output: z.object({
        input: z.string(),
      }),
      // @ts-expect-error - ensure type inferred from "output" is expected as "resolve" fn return type
      async resolve({ input }) {
        return { input };
      },
    })
    .query('withInputOutput', {
      input: z.string(),
      output: z.object({
        input: z.string(),
      }),
      async resolve({ input }) {
        return { input };
      },
    });
  type TQueries = typeof router['_def']['queries'];
  {
    const input: inferProcedureInput<TQueries['noInput']> = null as any;
    const output: inferProcedureOutput<TQueries['noInput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<undefined | null | void>();
    expectTypeOf(output).toMatchTypeOf<{ input: undefined }>();
  }
  {
    const input: inferProcedureInput<TQueries['withInput']> = null as any;
    const output: inferProcedureOutput<TQueries['withInput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<string>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
  {
    const input: inferProcedureInput<TQueries['withOutput']> = null as any;
    const output: inferProcedureOutput<TQueries['withOutput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<undefined | null | void>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
  {
    const input: inferProcedureInput<TQueries['withInputOutput']> = null as any;
    const output: inferProcedureOutput<TQueries['withInputOutput']> =
      null as any;
    expectTypeOf(input).toMatchTypeOf<string>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
});

test('infer mutation input & output', async () => {
  const router = trpc
    .router()
    .mutation('noInput', {
      async resolve({ input }) {
        return { input };
      },
    })
    .mutation('withInput', {
      input: z.string(),
      output: z.object({
        input: z.string(),
      }),
      async resolve({ input }) {
        return { input };
      },
    })
    .mutation('withOutput', {
      output: z.object({
        input: z.string(),
      }),
      // @ts-expect-error - ensure type inferred from "output" is expected as "resolve" fn return type
      async resolve({ input }) {
        return { input };
      },
    })
    .mutation('withInputOutput', {
      input: z.string(),
      output: z.object({
        input: z.string(),
      }),
      async resolve({ input }) {
        return { input };
      },
    });
  type TMutations = typeof router['_def']['mutations'];
  {
    const input: inferProcedureInput<TMutations['noInput']> = null as any;
    const output: inferProcedureOutput<TMutations['noInput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<undefined | null | void>();
    expectTypeOf(output).toMatchTypeOf<{ input: undefined }>();
  }
  {
    const input: inferProcedureInput<TMutations['withInput']> = null as any;
    const output: inferProcedureOutput<TMutations['withInput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<string>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
  {
    const input: inferProcedureInput<TMutations['withOutput']> = null as any;
    const output: inferProcedureOutput<TMutations['withOutput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<undefined | null | void>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
  {
    const input: inferProcedureInput<TMutations['withInputOutput']> =
      null as any;
    const output: inferProcedureOutput<TMutations['withInputOutput']> =
      null as any;
    expectTypeOf(input).toMatchTypeOf<string>();
    expectTypeOf(output).toMatchTypeOf<{ input: string }>();
  }
});

test('infer subscription input & output', async () => {
  // @ts-expect-error - ensure "output" is omitted in subscription procedure
  const router = trpc
    .router()
    .subscription('noSubscription', {
      // @ts-expect-error - ensure Subscription is expected as "resolve" fn return type
      async resolve({ input }) {
        return { input };
      },
    })
    .subscription('noInput', {
      async resolve() {
        return new trpc.Subscription(() => () => null);
      },
    })
    .subscription('withInput', {
      input: z.string(),
      async resolve({ input }) {
        return new trpc.Subscription<typeof input>((emit) => {
          emit.data(input);
          return () => null;
        });
      },
    })
    .subscription('withOutput', {
      input: z.string(),
      output: z.null(),
      async resolve({ input }) {
        return new trpc.Subscription<typeof input>((emit) => {
          emit.data(input);
          return () => null;
        });
      },
    });
  type TSubscriptions = typeof router['_def']['subscriptions'];
  {
    const input: inferProcedureInput<TSubscriptions['noInput']> = null as any;
    const output: inferProcedureOutput<TSubscriptions['noInput']> = null as any;
    expectTypeOf(input).toMatchTypeOf<undefined | null | void>();
    expectTypeOf(output).toMatchTypeOf<trpc.Subscription<unknown>>();
  }
  {
    const input: inferProcedureInput<TSubscriptions['withInput']> = null as any;
    const output: inferProcedureOutput<TSubscriptions['withInput']> =
      null as any;
    expectTypeOf(input).toMatchTypeOf<string>();
    expectTypeOf(output).toMatchTypeOf<trpc.Subscription<string>>();
  }
});
