import { BundleTaskConfig, TransformTaskConfig, NodeEnvMode } from '../types.js';
import type { Config, ModuleConfig } from '@swc/core';
import getDefaultDefineValues from './getDefaultDefineValues.js';

// https://github.com/ice-lab/ice-next/issues/54#issuecomment-1083263523
const LEGACY_BROWSER_TARGETS = {
  chrome: 49,
  ie: 11,
};
const MODERN_BROWSER_TARGETS = {
  chrome: 61,
  safari: 11,
  firefox: 60,
  edge: 16,
  ios: 11,
};

export const getDefaultBundleSwcConfig = (bundleTaskConfig: BundleTaskConfig): Config => {
  const browserTargets = bundleTaskConfig.formats[0].target !== 'es5' ? MODERN_BROWSER_TARGETS : LEGACY_BROWSER_TARGETS;
  return {
    jsc: {
      externalHelpers: true,
    },
    minify: false,
    // Always generate map in bundle mode,
    // and leave minify-plugin to tackle with it.
    sourceMaps: true,
    // 由 env 字段统一处理 syntax & polyfills
    env: {
      targets: browserTargets,
      coreJs: '3.29',
      mode: bundleTaskConfig.polyfill === false ? undefined : bundleTaskConfig.polyfill,
    },
  };
};

export const getDefaultTransformSwcConfig = (transformTaskConfig: TransformTaskConfig, mode: NodeEnvMode): Config => {
  const module: ModuleConfig = transformTaskConfig.format.module === 'cjs' ? { type: 'commonjs' } : undefined;

  const target = transformTaskConfig.format.target === 'es2017' ? 'es2017' : 'es5';

  return {
    jsc: {
      target,
      transform: {
        optimizer: {
          globals: {
            vars: {
              ...getDefaultDefineValues(mode),
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
