import merge from 'lodash.merge';
import getTaskConfig from './getTaskConfig.js';

import type { Service } from 'build-scripts';
import type { UserConfigExport, ConfigEnv, UserConfig as VitestUserConfig, UserConfigFn as VitestUserConfigFn } from 'vitest/config';
import type { TaskConfig, UserConfig } from '../types';

export default function defineVitestConfig(
  service: Service<TaskConfig, {}, UserConfig>,
  userConfig: UserConfigExport,
): VitestUserConfigFn {
  return async (env: ConfigEnv) => {
    // Support vitest configuration (object or function) Ref: https://github.com/vitest-dev/vitest/blob/e5c40cff0925c3c12d8cdfa59f5649d3562668ce/packages/vitest/src/config.ts#L3
    let customConfig: VitestUserConfig;
    if (typeof userConfig === 'function') {
      customConfig = await userConfig(env);
    } else {
      customConfig = await userConfig;
    }

    const defaultConfig = await getDefaultConfig(service);

    return merge(defaultConfig, customConfig);
  };
}

async function getDefaultConfig(service: Service<TaskConfig, {}, UserConfig>): Promise<VitestUserConfig> {
  const { taskConfig } = await getTaskConfig(service);
  const { alias = {}, define = {} } = taskConfig;
  return {
    resolve: {
      alias,
    },
    // FIXME: pass the custom define config
    define,
  };
}
