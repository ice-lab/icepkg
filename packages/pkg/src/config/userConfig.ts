import { mergeValueToTaskConfig } from '../utils.js';
import deepmerge from 'deepmerge';

import type {
  BundleTaskConfig,
  TaskConfig,
  UserConfig,
  BundleUserConfig,
  TransformUserConfig,
  TransformTaskConfig,
} from '../types.js';

function getUserConfig() {
  const defaultBundleUserConfig: BundleUserConfig = {
    formats: ['esm', 'es2017'],
    modes: ['production'],
  };
  const defaultTransformUserConfig: TransformUserConfig = {
    formats: ['esm', 'es2017'],
  };
  const userConfig = [
    {
      name: 'entry',
      validation: 'string|object',
      defaultValue: './src/index',
      setConfig: (config: TaskConfig, entry: UserConfig['entry']) => {
        return mergeValueToTaskConfig(config, 'entry', entry);
      },
    },
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
    // TODO: validate values recursively
    {
      name: 'transform',
      validation: 'object',
      defaultValue: defaultTransformUserConfig,
      setConfig: (config: TaskConfig, transformConfig: UserConfig['transform']) => {
        if (config.type === 'transform') {
          let newConfig = config;
          const mergedConfig = deepmerge(
            defaultTransformUserConfig,
            transformConfig,
            { arrayMerge: (destinationArray, sourceArray) => sourceArray },
          );
          Object.keys(mergedConfig).forEach((key) => {
            newConfig = mergeValueToTaskConfig<TransformTaskConfig>(
              newConfig,
              key,
              mergedConfig[key],
            );
          });
          return newConfig;
        }
      },
    },
    {
      name: 'bundle',
      validation: 'object',
      defaultValue: defaultBundleUserConfig,
      setConfig: (config: TaskConfig, bundleConfig: UserConfig['bundle']) => {
        if (config.type === 'bundle') {
          let newConfig = config;
          const mergedConfig = deepmerge(
            defaultBundleUserConfig,
            bundleConfig,
            { arrayMerge: (destinationArray, sourceArray) => sourceArray },
          );
          // Compatible with `bundle.development` config
          if (mergedConfig.development && !mergedConfig.modes.includes('development')) {
            delete mergedConfig.development;
            mergedConfig.modes.push('development');
          }

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
