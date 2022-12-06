import { mergeValueToTaskConfig } from '../utils.js';
import deepmerge from 'deepmerge';
import type { BundleTaskConfig, TaskConfig, UserConfig } from '../types.js';

function getUserConfig() {
  const defaultBundleValue = {
    formats: ['esm', 'es2017'],
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
      setConfig: (config: TaskConfig, define: UserConfig['define']) => {
        return mergeValueToTaskConfig(config, 'define', define);
      },
    },
    // TODO: Modify `sourcemaps` to `sourcemap` and make sure to be compatible with icepkg v1 version.
    {
      name: 'sourceMaps',
      validation: (val: boolean | 'inline') => {
        return typeof val === 'boolean' || val === 'inline';
      },
      setConfig: (config: TaskConfig, sourcemap: UserConfig['sourceMaps']) => {
        return mergeValueToTaskConfig(config, 'sourcemap', sourcemap);
      },
    },
    {
      name: 'generateTypesForJs',
      validation: 'boolean',
      default: false,
    },
    // FIXME: validate values recursively
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
        if (config.type === 'bundle') {
          let newConfig = config;
          const mergedConfig = deepmerge(
            defaultBundleValue,
            bundle,
            { arrayMerge: (destinationArray, sourceArray) => sourceArray },
          );
          Object.keys(mergedConfig).forEach((key) => {
            newConfig = mergeValueToTaskConfig<BundleTaskConfig>(
              newConfig,
              key,
              mergedConfig[key],
            );
          });
          return newConfig;
        }
      },
    },
  ];
  return userConfig;
}

export default getUserConfig;
