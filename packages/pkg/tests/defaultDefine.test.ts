import { describe, expect, it } from 'vitest';
import getDefaultDefineValues from '../src/engine/shared/define';

describe('getDefaultDefineValues', () => {
  it('should include vitest in-source test guard by default', () => {
    expect(getDefaultDefineValues('development')).toEqual({
      __DEV__: 'true',
      'process.env.NODE_ENV': '"development"',
      'import.meta.vitest': 'undefined',
    });
  });

  it('should preserve production defaults', () => {
    expect(getDefaultDefineValues('production')).toEqual({
      __DEV__: 'false',
      'process.env.NODE_ENV': '"production"',
      'import.meta.vitest': 'undefined',
    });
  });
});
