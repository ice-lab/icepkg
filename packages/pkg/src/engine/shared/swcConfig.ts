import { BundleTaskConfig, TransformTaskConfig, NodeEnvMode, JsTarget } from '../../types.js';
import type { Config, ModuleConfig } from '@swc/core';
import getDefaultDefineValues from './define.js';
import { ALL_FORMAT_TARGET } from '../../constants.js';

// https://github.com/ice-lab/ice-next/issues/54#issuecomment-1083263523
const BROWSER_TARGETS_MAP: Record<JsTarget, any> = {
  es5: {
    chrome: 49,
    ie: 11,
  },
  es2017: {
    chrome: 61,
    safari: 11,
    firefox: 60,
    edge: 16,
    ios: 11,
  },
  es2022: {
    chrome: 85,
    safari: 15,
    firefox: 79,
    edge: 85,
    ios: 15,
  },
};

export const getDefaultBundleSwcConfig = (bundleTaskConfig: BundleTaskConfig): Config => {
  const formatTarget = bundleTaskConfig.formats[0].target;
  const browserTargets = BROWSER_TARGETS_MAP[formatTarget] ?? BROWSER_TARGETS_MAP.es2017;
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
  const module: ModuleConfig | undefined =
    transformTaskConfig.format.module === 'cjs' ? { type: 'commonjs' } : undefined;

  const target = ALL_FORMAT_TARGET.includes(transformTaskConfig.format.target)
    ? transformTaskConfig.format.target
    : 'es5';

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

export function getTaskSwcOptions(taskConfig: TransformTaskConfig | BundleTaskConfig) {
  let { swcCompileOptions = {} } = taskConfig;
  const defaultSwcOptions =
    taskConfig.type === 'transform'
      ? getDefaultTransformSwcConfig(taskConfig, taskConfig.modes![0])
      : getDefaultBundleSwcConfig(taskConfig);

  swcCompileOptions = {
    ...defaultSwcOptions,
    ...swcCompileOptions,
  };

  if (taskConfig.modifySwcCompileOptions) {
    swcCompileOptions = taskConfig.modifySwcCompileOptions(swcCompileOptions);
  }

  return swcCompileOptions;
}
