import type { UserConfig } from '@ice/pkg-cli';

export const registerdUserConfig = [
  {
    name: 'umd',
    validation: (val: UserConfig['umd']) => {
      // FIXME: build-scripts 支持下递归校验
      return true;
    },
  },
  {
    name: 'lib',
    validation: 'boolean',
    defaultValue: false,
  },
  {
    name: 'babelPlugins',
    defaultValue: [],
  },
  {
    name: 'define',
    validation: 'object',
    defaultValue: {},
  },
  {
    name: 'alias',
    validation: 'object',
    defaultValue: {},
  },
  {
    name: 'minify',
    validation: 'boolean|object',
    defaultValue: false,
  },
  {
    name: 'sourceMaps',
    validation: (val: boolean | 'inline') => {
      return typeof val === 'boolean' || val === 'inline';
    },
    defaultValue: false,
  },
  {
    name: 'exclude',
    validation: 'string|array',
  },
  {
    name: 'include',
    validation: 'string|array',
  },
  {
    name: 'generateTypesForJs',
    validation: 'boolean',
    default: false,
  },
];
