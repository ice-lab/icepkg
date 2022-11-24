import * as config from './config/index.js';
import { TaskName } from '@ice/pkg';

import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const {
    registerUserConfig,
    registerTask,
    context,
  } = api;

  const { userConfig } = context;

  registerUserConfig(config.userConfig);

  (userConfig?.transform?.formats || ['esm', 'es2017']).forEach((format) => {
    registerTask(`transform-${format}`, {
      type: 'transform',
    });
  });

  if (userConfig?.bundle) {
    const bundleTasks = (userConfig?.bundle?.formats || ['esm', 'es2017']);
    if (bundleTasks.includes('umd') || bundleTasks.includes('esm') || bundleTasks.includes('cjs')) {
      registerTask(TaskName.BUNDLE_ES5, {
        type: 'bundle',
      });
    }

    if (bundleTasks.includes('es2017')) {
      registerTask(TaskName.BUNDLE_ES2017, {
        type: 'bundle',
      });
    }
  }
};

export default plugin;
