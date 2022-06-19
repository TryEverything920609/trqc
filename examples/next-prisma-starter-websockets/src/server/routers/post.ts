/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Context } from '../context';
import { t } from '../trpc';
import { Post } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { z } from 'zod';

interface MyEvents {
  add: (data: Post) => void;
  postIsTypingUpdateUpdate: () => void;
}
declare interface MyEventEmitter {
  on<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  once<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  emit<U extends keyof MyEvents>(
    event: U,
    ...args: Parameters<MyEvents[U]>
  ): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyEventEmitter extends EventEmitter {}

const ee = new MyEventEmitter();

// who is currently typing, key is `name`
const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

// every 1s, clear old "postIsTypingUpdate"
const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit('postIsTypingUpdateUpdate');
  }
}, 3e3);
process.on('SIGTERM', () => clearInterval(interval));

const getNameOrThrow = (ctx: Context) => {
  const name = ctx.session?.user?.name;
  if (!name) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return name;
};

export const postRouter = t.router({
  queries: {
    postList: t.procedure
      .input(
        z.object({
          cursor: z.date().nullish(),
          take: z.number().min(1).max(50).nullish(),
        }),
      )
      .resolve(async ({ input, ctx }) => {
        const take = input.take ?? 10;
        const cursor = input.cursor;
        // `cursor` is of type `Date | undefined`
        // `take` is of type `number | undefined`
        const page = await ctx.prisma.post.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          cursor: cursor
            ? {
                createdAt: cursor,
              }
            : undefined,
          take: take + 1,
          skip: 0,
        });
        const items = page.reverse();
        let prevCursor: null | typeof cursor = null;
        if (items.length > take) {
          const prev = items.shift();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          prevCursor = prev!.createdAt;
        }
        return {
          items,
          prevCursor,
        };
      }),
  },
  mutations: {
    postAdd: t.procedure
      .input(
        z.object({
          id: z.string().uuid().optional(),
          text: z.string().min(1),
        }),
      )
      .resolve(async ({ ctx, input }) => {
        const name = getNameOrThrow(ctx);
        const post = await ctx.prisma.post.create({
          data: {
            ...input,
            name,
            source: 'GITHUB',
          },
        });
        ee.emit('add', post);
        delete currentlyTyping[name];
        ee.emit('postIsTypingUpdateUpdate');
        return post;
      }),
    postIsTypingUpdate: t.procedure
      .input(
        z.object({
          typing: z.boolean(),
        }),
      )
      .resolve(({ ctx, input }) => {
        const name = getNameOrThrow(ctx);
        if (!input.typing) {
          delete currentlyTyping[name];
        } else {
          currentlyTyping[name] = {
            lastTyped: new Date(),
          };
        }
        ee.emit('postIsTypingUpdateUpdate');
      }),
  },
  subscriptions: {
    postOnAdd: t.procedure.resolve(() => {
      return observable<Post>((emit) => {
        const onAdd = (data: Post) => emit.next(data);
        ee.on('add', onAdd);
        return () => {
          ee.off('add', onAdd);
        };
      });
    }),
    postWhoIsTyping: t.procedure.resolve(() => {
      let prev: string[] | null = null;
      return observable<string[]>((emit) => {
        const onpostIsTypingUpdateUpdate = () => {
          const newData = Object.keys(currentlyTyping);

          if (!prev || prev.toString() !== newData.toString()) {
            emit.next(newData);
          }
          prev = newData;
        };
        ee.on('postIsTypingUpdateUpdate', onpostIsTypingUpdateUpdate);
        return () => {
          ee.off('postIsTypingUpdateUpdate', onpostIsTypingUpdateUpdate);
        };
      });
    }),
  },
});
