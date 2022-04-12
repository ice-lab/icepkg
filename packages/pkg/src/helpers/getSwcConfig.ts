import { booleanToObject, stringifyObject } from '../utils.js';

import type { UserConfig, TaskName } from '../types.js';
import type { Config, ModuleConfig } from '@swc/core';

export const getBundleSwcConfig = (userConfig: UserConfig): Config => {
  const minify = true;
  const sourceMaps = userConfig?.sourceMaps;
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

export const getTransformSwcConfig = (userConfig: UserConfig, taskName: TaskName): Config => {
  const sourceMaps = userConfig?.sourceMaps;
  const define = stringifyObject(userConfig?.define ?? {});

  const module: ModuleConfig = taskName === 'pkg-cjs'
    ? { type: 'commonjs' }
    : undefined;

  const target = taskName === 'pkg-es2017' ? 'es2017' : 'es5';

  return {
    jsc: {
      target,
      transform: {
        optimizer: {
          globals: {
            vars: {
              // Insert __DEV__ for users, can be overrided too.
              __DEV__: "process.env.NODE_ENV === 'development'",
              ...define,
            },
          },
        },
      },
      // FIXME: How to resolve @swc/helper
      // Helpers function will not be inlined into the output files for sake of optimizing.
      // Get more info https://github.com/ice-lab/ice-next/issues/95
      externalHelpers: true,
    },
    module,
    sourceMaps,
  };
};
