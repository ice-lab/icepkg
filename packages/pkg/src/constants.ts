import {
  AliasBundleFormatString,
  AliasTransformFormatString,
  StandardBundleFormatString,
  StandardTransformFormatString,
} from './types.js';

export const JSX_RUNTIME_SOURCE = '@ice/jsx-runtime';

export const ALIAS_TRANSFORM_FORMATS_MAP: Record<AliasTransformFormatString, StandardTransformFormatString> = {
  esm: 'esm:es5',
  es2017: 'esm:es2017',
  cjs: 'cjs:es5',
};

export const ALIAS_BUNDLE_FORMATS_MAP: Record<AliasBundleFormatString, StandardBundleFormatString> = {
  umd: 'umd:es5',
  esm: 'esm:es5',
  es2017: 'esm:es2017',
  cjs: 'cjs:es5',
};

export const NODE_FORMAT_MODULE = ['cjs', 'esm'] as const;
export const ALL_FORMAT_MODULES = [...NODE_FORMAT_MODULE, 'umd'] as const;
export const ALL_FORMAT_TARGET = ['es5', 'es2017', 'es2022'] as const;
