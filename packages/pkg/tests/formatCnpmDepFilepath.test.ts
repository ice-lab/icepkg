import { expect, it, describe } from 'vitest';
import { formatCnpmDepFilepath } from '../src/utils';

describe('formatCnpmDepFilepath function', () => {
  it('pnpm path', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/.pnpm/classnames@2.3.2/node_modules/classnames/index.js')).toBe('/workspace/node_modules/.pnpm/classnames@2.3.2/node_modules/classnames/index.js');
  })
  it('pnpm path with scope', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/.pnpm/@actions+exec@1.1.1/node_modules/@actions/exec/lib/exec.js')).toBe('/workspace/node_modules/.pnpm/@actions+exec@1.1.1/node_modules/@actions/exec/lib/exec.js');
  })
  it('cnpm path', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/_idb@7.1.1@idb/build/index.js')).toBe('/workspace/node_modules/idb/build/index.js');
  })
  it('cnpm path with npm scope', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/_@swc_helpers@0.5.3@@swc/helpers/esm/_extends.js')).toBe('/workspace/node_modules/@swc/helpers/esm/_extends.js');
  })
  it('npm path', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/idb/build/index.js')).toBe('/workspace/node_modules/idb/build/index.js');
  })
  it('npm path with npm scope', () => {
    expect(formatCnpmDepFilepath('/workspace/node_modules/@ice/idb/build/index.js')).toBe('/workspace/node_modules/@ice/idb/build/index.js');
  })
})
