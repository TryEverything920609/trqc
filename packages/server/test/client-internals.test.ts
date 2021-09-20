/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-native-reassign */

import { getAbortController } from '../../client/src/internals/fetchHelpers';
import { getFetch } from '../../client/src';

describe('getAbortController() from..', () => {
  test('passed', () => {
    const sym: any = Symbol('test');
    expect(getAbortController(sym)).toBe(sym);
  });
  test('window', () => {
    const sym: any = Symbol('test');

    (global as any).AbortController = undefined;
    (global as any).window = {};
    (global as any).window = AbortController = sym;
    expect(getAbortController()).toBe(sym);
  });
  test('global', () => {
    const sym: any = Symbol('test');

    (global as any).AbortController = sym;
    delete (global as any).window;
    expect(getAbortController()).toBe(sym);
  });
  test('neither', () => {
    (global as any).AbortController = undefined;
    (global as any).window = undefined;
    expect(getAbortController()).toBe(null);
  });
});

describe('getFetch() from...', () => {
  test('passed', () => {
    const sym: any = Symbol('test');
    expect(getFetch(sym)).toBe(sym);
  });
  test('window', () => {
    const sym: any = Symbol('test');

    (global as any).fetch = undefined;
    (global as any).window = {};
    (global as any).window.fetch = sym;
    expect(getFetch()).toBe(sym);
  });
  test('global', () => {
    const sym: any = Symbol('test');

    (global as any).fetch = sym;
    delete (global as any).window;
    expect(getFetch()).toBe(sym);
  });
  test('neither -> throws', () => {
    (global as any).fetch = undefined;
    (global as any).window = undefined;
    expect(() => getFetch()).toThrowError();
  });
});
