import { createTRPCProxyClient } from '../../client';
import { httpBatchLink } from '../../client/src';

global.fetch = jest.fn();

describe('typedefs on createClient', () => {
  test('ok to pass only links', () => {
    createTRPCProxyClient({
      links: [httpBatchLink({ url: 'foo' })],
    });
  });

  test('ok to pass only url', () => {
    createTRPCProxyClient({
      url: 'foo',
    });
  });

  test('error if both url and links are passed', () => {
    createTRPCProxyClient({
      links: [httpBatchLink({ url: 'foo' })],
      // @ts-expect-error - can't pass url along with links
      url: 'foo',
    });
  });

  test('error if neither url and links are passed', () => {
    // @ts-expect-error - must pass url or links
    createTRPCProxyClient({});
  });
});
