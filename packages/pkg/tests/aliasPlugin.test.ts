import { expect, it, describe } from 'vitest';
import { matches, resolveAliasConfig } from '../src/rollupPlugins/alias';

describe('aliasPlugin', () => {
  it('matches alias id', () => {
    // length not match
    expect(matches('foo', 'fo')).toBe(false);
    expect(matches('@', '')).toBe(false);
    // match
    expect(matches('foo', 'foo')).toBe(true);
    expect(matches('foo', 'foo/bar')).toBe(true);
    expect(matches('foo', 'foo/bar/baz')).toBe(true);
    expect(matches('@', '@/bar')).toBe(true);
    expect(matches('@', '@/bar/baz')).toBe(true);
    // start string not match
    expect(matches('foo', 'foo-bar')).toBe(false);
    expect(matches('foo', 'foo-bar/baz')).toBe(false);
    expect(matches('foo', 'foo-bar/baz/qux')).toBe(false);
  })

  it('resolve alias config', () => {
    // module
    expect(resolveAliasConfig({
      'react': 'react-dom',
    }, '/workspace', '/workspace/src/index.tsx')).toEqual({
      'react': 'react-dom',
    })
    // relative path
    expect(resolveAliasConfig({
      '@': './src',
    }, '/workspace', '/workspace/src/components/index.tsx')).toEqual({
      '@': '..',
    })
    expect(resolveAliasConfig({
      '@': './src',
    }, '/workspace', '/workspace/src/index.tsx')).toEqual({
      '@': '.',
    })
    expect(resolveAliasConfig({
      '@': './src',
    }, '/workspace', '/workspace/src/components/Button/index.tsx')).toEqual({
      '@': '../..',
    })
  })
})
