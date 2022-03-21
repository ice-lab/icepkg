import { booleanToObject, stringifyObject } from '../utils.js';

import type { UserConfig } from '../types.js';
import type { Config, ModuleConfig } from '@swc/core';

export const getBundleSwcConfig = (userConfig: UserConfig): Config => {
  const minify = userConfig?.umd?.minify ?? userConfig?.minify;
  const sourceMaps = userConfig?.umd?.sourceMaps ?? userConfig?.sourceMaps;
  const define = stringifyObject(userConfig?.define ?? {});

  return {
    jsc: {
      minify: {
        compress: {
          unused: false,
        },
        ...booleanToObject(minify),
      },
      transform: {
        optimizer: {
          globals: {
            vars: define,
          },
        },
      },
    },
    sourceMaps,
    minify: !!minify,
    // 由 env 字段统一处理 synax & polyfills
    env: {
      targets: {
        chrome: 49,
        ie: 11,
      },
      mode: 'usage',
      coreJs: '3',
    },
  };
};

export const getTransformSwcConfig = (userConfig: UserConfig, taskName: string): Config => {
  const minify = userConfig?.minify;
  const sourceMaps = userConfig?.sourceMaps;
  const define = stringifyObject(userConfig?.define ?? {});

  const module: ModuleConfig = taskName === 'component-lib'
    ? { type: 'commonjs' }
    : undefined;

  const target = taskName === 'component-esnext' ? 'es2022' : 'es5';

  return {
    jsc: {
      target,
      minify: {
        compress: {
          unused: false,
        },
        ...booleanToObject(minify),
      },
      transform: {
        optimizer: {
          globals: {
            vars: define,
          },
        },
      },
    },
    module,
    sourceMaps,
    minify: !!minify,
  };
};
