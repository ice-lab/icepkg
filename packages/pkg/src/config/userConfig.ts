import { mergeValueToTaskConfig } from '../utils.js';
import deepmerge from 'deepmerge';
import type { TaskConfig, UserConfig } from '../types.js';

function getUserConfig(command: string) {
  const defaultBundleValue = {
    formats: ['esm', 'es2017'],
    minify: command === 'build',
  };
  const defaultTransformValue = {
    formats: ['esm', 'es2017'],
  };

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
      defaultValue: defaultTransformValue,
    },
    {
      name: 'bundle',
      validation: 'object',
      defaultValue: defaultBundleValue,
      setConfig: (config: TaskConfig, bundle: UserConfig['bundle']) => {
        return mergeValueToTaskConfig(config, 'bundle', deepmerge(defaultBundleValue, bundle));
      },
    },
  ];
  return userConfig;
}

export default getUserConfig;
