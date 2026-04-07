import { test, expect } from 'vitest';
import { formatEntry, getCommonAncestorDir, getTransformEntryRoot } from '../../src/helpers/getTaskIO.js';

test('formatEntry', () => {
  expect(formatEntry('src/index')).toEqual({
    index: 'src/index',
  });

  expect(formatEntry(['src/index', 'src/client'])).toEqual({
    index: 'src/index',
    client: 'src/client',
  });

  expect(
    formatEntry({
      index: 'src/index',
      client: 'src/client',
    }),
  ).toEqual({
    index: 'src/index',
    client: 'src/client',
  });
});

test('getCommonAncestorDir', () => {
  expect(getCommonAncestorDir(['/root/src/a', '/root/src/b'])).toEqual('/root/src');
  expect(getCommonAncestorDir(['/root/src/a'])).toEqual('/root/src/a');
  expect(getCommonAncestorDir(['/root/src/a/b/c', '/root/src/a/b/d/e'])).toEqual('/root/src/a/b');
  expect(getCommonAncestorDir(['/root/src/a/b/c', '/root/src/x/y'])).toEqual('/root/src');
  expect(getCommonAncestorDir([])).toEqual('');
});

test('getTransformEntryRoot', () => {
  const entry = {
    a: './src/a/index.ts',
    b: './src/b/index.ts',
  };

  expect(getTransformEntryRoot('/root', entry)).toEqual('/root/src');
  expect(getTransformEntryRoot('/root', entry, './src')).toEqual('/root/src');
  expect(getTransformEntryRoot('/root', entry, '/root/src')).toEqual('/root/src');
  expect(() => getTransformEntryRoot('/root', entry, './src/a')).toThrowError(/Invalid entryRoot/);
});

test('getTransformEntryRoot with nested entries', () => {
  const entry = {
    one: './src/features/user/index.ts',
    two: './src/features/order/internal/main.ts',
    three: './src/features/user/profile/detail.ts',
  };

  expect(getTransformEntryRoot('/root', entry)).toEqual('/root/src/features');
  expect(getTransformEntryRoot('/root', entry, './src/features')).toEqual('/root/src/features');
  expect(getTransformEntryRoot('/root', entry, './src')).toEqual('/root/src');
  expect(() => getTransformEntryRoot('/root', entry, './src/features/user')).toThrowError(/Invalid entryRoot/);
});

test('getTransformEntryRoot with single deeply nested entry', () => {
  const entry = {
    one: './src/components/button/variants/primary/index.ts',
  };

  expect(getTransformEntryRoot('/root', entry)).toEqual('/root/src/components/button/variants/primary');
  expect(getTransformEntryRoot('/root', entry, './src/components')).toEqual('/root/src/components');
});
