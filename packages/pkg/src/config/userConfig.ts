import { mergeValueToTaskConfig } from '../utils.js';
import type { TaskConfig, UserConfig } from '../types.js';

const userConfig = [
  {
    name: 'alias',
    validation: 'object',
    defaultValue: {},
    setConfig: (config: TaskConfig, alias: UserConfig['alias']) => {
      return mergeValueToTaskConfig(config, 'alias', alias);
    },
  },
  {
    name: 'define',
    validation: 'object',
    defaultValue: {},
  },
  {
    name: 'sourceMaps',
    validation: (val: boolean | 'inline') => {
      return typeof val === 'boolean' || val === 'inline';
    },
    defaultValue: false,
  },
  {
    name: 'generateTypesForJs',
    validation: 'boolean',
    default: false,
  },
  // FIXME: validate values recursivly
  {
    name: 'transform',
    validation: 'object',
    defaultValue: {
      formats: ['esm', 'es2017'],
    },
  },
  {
    name: 'bundle',
    validation: 'object',
    defaultValue: {
      formats: ['esm', 'es2017'],
      minify: true,
    },
    setConfig: (config: TaskConfig, bundle: UserConfig['bundle']) => {
      return mergeValueToTaskConfig(config, 'bundle', bundle);
    },
  },
];

export default userConfig;
