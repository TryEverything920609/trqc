import { AnyRouter } from '@trpc/server/src';
import { observable } from '../../observable';
import { createChain } from './createChain';

describe('chain', () => {
  test('trivial', () => {
    const result$ = createChain<AnyRouter, unknown, unknown>({
      links: [
        ({ next, op }) => {
          return observable((observer) => {
            const subscription = next(op).subscribe(observer);
            return () => {
              subscription.unsubscribe();
            };
          });
        },
        ({ op }) => {
          return observable((observer) => {
            observer.next({
              context: {},
              data: {
                id: null,
                result: {
                  type: 'data',
                  data: {
                    input: op.input,
                  },
                },
              },
            });
            observer.complete();
          });
        },
      ],
      op: {
        type: 'query',
        id: 1,
        input: 'world',
        path: 'hello',
        context: {},
      },
    });

    const next = jest.fn();

    result$.subscribe({ next });
    // console.log(next.mock.calls);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test('multiple responses', () => {
    const result$ = createChain<AnyRouter, unknown, unknown>({
      links: [
        ({ next, op }) => {
          return observable((observer) => {
            observer.next({
              context: {},
              data: {
                id: null,
                result: {
                  type: 'data',
                  data: 'from cache',
                },
              },
            });
            const subscription = next(op).subscribe(observer);
            return () => {
              subscription.unsubscribe();
            };
          });
        },
        ({ op }) => {
          return observable((observer) => {
            observer.next({
              data: {
                id: null,
                result: {
                  type: 'data',
                  data: {
                    input: op.input,
                  },
                },
              },
            });
            observer.complete();
          });
        },
      ],
      op: {
        type: 'query',
        id: 1,
        input: 'world',
        path: 'hello',
        context: {},
      },
    });

    const next = jest.fn();

    result$.subscribe({ next });

    expect(next).toHaveBeenCalledTimes(2);
    expect(next.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "context": Object {},
          "data": Object {
            "id": null,
            "result": Object {
              "data": "from cache",
              "type": "data",
            },
          },
        },
      ]
    `);
    expect(next.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "id": null,
            "result": Object {
              "data": Object {
                "input": "world",
              },
              "type": "data",
            },
          },
        },
      ]
    `);
  });
});
