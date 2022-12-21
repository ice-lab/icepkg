import {
  BundleTaskConfig,
  Context,
  ReverseMap,
  TaskConfig,
  TaskName,
  TransformTaskConfig,
} from '../types.js';
import type { Config, JscConfig, ModuleConfig } from '@swc/core';

export const getDefaultBundleSwcConfig = (
  bundleTaskConfig: BundleTaskConfig,
  ctx: Context,
  taskName: ReverseMap<typeof TaskName>,
): Config => {
  const target = taskName === TaskName.BUNDLE_ES2017 ? 'es2017' : 'es5';

  const browserTargets = taskName === TaskName.BUNDLE_ES2017 ? {
    // https://github.com/ice-lab/ice-next/issues/54#issuecomment-1083263523
    chrome: 61,
    safari: 10.1,
    firefox: 60,
    edge: 16,
    ios: 11,
  } : {
    chrome: 49,
    ie: 11,
  };

  return {
    jsc: {
      target,
      baseUrl: ctx.rootDir,
      paths: formatAliasPaths(bundleTaskConfig.alias),
    },
    minify: false,
    // Always generate map in bundle mode,
    // and leave minify-plugin to tackle with it.
    sourceMaps: true,
    // 由 env 字段统一处理 syntax & polyfills
    env: {
      targets: browserTargets,
      mode: 'usage',
      coreJs: '3',
    },
  };
};

export const getDefaultTransformSwcConfig = (
  transformTaskConfig: TransformTaskConfig,
  ctx: Context,
  taskName: ReverseMap<typeof TaskName>,
): Config => {
  const module: ModuleConfig = taskName === TaskName.TRANSFORM_CJS
    ? { type: 'commonjs' }
    : undefined;

  const target = taskName === TaskName.TRANSFORM_ES2017 ? 'es2017' : 'es5';

  return {
    jsc: {
      target,
      baseUrl: ctx.rootDir,
      paths: formatAliasPaths(transformTaskConfig.alias),
      transform: {
        optimizer: {
          globals: {
            vars: {
              ...transformTaskConfig.define,
            },
          },
        },
      },
      // Helpers function will not be inlined into the output files for sake of optimizing.
      // Get more info https://github.com/ice-lab/ice-next/issues/95
      externalHelpers: true,
    },
    minify: false,
    module,
    sourceMaps: transformTaskConfig.sourcemap,
  };
};

function formatAliasPaths(alias: TaskConfig['alias']) {
  const paths: JscConfig['paths'] = {};

  Object.entries(alias || {}).forEach(([key, value]) => {
    const [pathKey, pathValue] = formatPath(key, value);
    paths[pathKey] = [pathValue];
  });

  return paths;
}

function formatPath(key: string, value: string) {
  if (key.endsWith('$')) {
    return [key.replace(/\$$/, ''), value];
  }
  // abc -> abc/*
  // abc/ -> abc/*
  return [addWildcard(key), addWildcard(value)];
}

function addWildcard(str: string) {
  return `${str.endsWith('/') ? str : `${str}/`}*`;
}
