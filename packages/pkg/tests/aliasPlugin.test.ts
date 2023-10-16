import { expect, it, describe } from 'vitest';
import aliasPlugin, { matches, resolveAliasConfig } from '../src/rollupPlugins/alias';

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

  it('alias plugin transform', async () => {
    const plugin = aliasPlugin(
      '/workspace',
      {
        '@': './src',
        'react': 'react-dom',
      }
    );
    const result1 = await (plugin as any).transform(
      'console.log()',
      '/workspace/src/index.tsx',
    )
    expect(result1.code).toBe('console.log()');

    const result2 = await (plugin as any).transform(
      'import react from "react";',
      '/workspace/src/index.tsx',
    )
    expect(result2.code).toBe('import react from "react-dom";');

    const result3 = await (plugin as any).transform(
      'import Button from "@/components/Button";',
      '/workspace/src/index.tsx',
    )
    expect(result3.code).toBe('import Button from "./components/Button";');

    const result4 = await (plugin as any).transform(
      'import Button from "@/components/Button";',
      '/workspace/src/pages/index.tsx',
    )
    expect(result4.code).toBe('import Button from "../components/Button";');
  })
})
