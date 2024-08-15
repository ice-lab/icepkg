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
    outputDir: 'dist',
    minify: {
      js: (mode: string, command: string) => { return mode === 'production' && command === 'build'; },
      css: (mode: string, command: string) => { return mode === 'production' && command === 'build'; },
    },
    polyfill: 'usage',
    compileDependencies: false,
  };
  const defaultTransformUserConfig: TransformUserConfig = {
    formats: ['esm', 'es2017'],
  };
  const userConfig = [
    {
      name: 'entry',
      validation: 'string|object',
      defaultValue: 'src/index',
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
      name: 'jsxRuntime',
      validation: (val: string) => {
        return val === 'classic' || val === 'automatic';
      },
      defaultValue: 'automatic',
      setConfig: (config: TaskConfig, jsxRuntime: UserConfig['jsxRuntime']) => {
        return mergeValueToTaskConfig(config, 'jsxRuntime', jsxRuntime);
      },
    },
    {
      name: 'generateTypesForJs',
      validation: 'boolean',
      defaultValue: false,
    },
    {
      name: 'declaration',
      validation: 'boolean',
      defaultValue: true,
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
          // Set outputDir to process.env for CI
          process.env.ICE_PKG_BUNDLE_OUTPUT_DIR = mergedConfig.outputDir;
          // Compatible with `bundle.development` config
          if (mergedConfig.development && !mergedConfig.modes.includes('development')) {
            delete mergedConfig.development;
            mergedConfig.modes.push('development');
          }

          const originMinifyConfig = mergedConfig.minify;
          delete mergedConfig.minify;

          Object.keys(mergedConfig).forEach((key) => {
            newConfig = mergeValueToTaskConfig<BundleTaskConfig>(
              newConfig,
              key,
              mergedConfig[key],
            );
          });

          if (typeof originMinifyConfig === 'boolean') {
            newConfig.jsMinify = () => originMinifyConfig;
            newConfig.cssMinify = () => originMinifyConfig;
          } else if (typeof originMinifyConfig === 'object') {
            switch (typeof originMinifyConfig.js) {
              case 'boolean':
                newConfig.jsMinify = () => (originMinifyConfig.js) as boolean;
                break;
              case 'function':
                newConfig.jsMinify = originMinifyConfig.js;
                break;
              default:
                break;
            }

            switch (typeof originMinifyConfig.css) {
              case 'boolean':
                newConfig.cssMinify = () => (originMinifyConfig.css) as boolean;
                break;
              case 'function':
                newConfig.cssMinify = originMinifyConfig.css;
                break;
              default:
                break;
            }
          }

          return newConfig;
        }
      },
    },
  ];
  return userConfig;
}

export default getUserConfig;
