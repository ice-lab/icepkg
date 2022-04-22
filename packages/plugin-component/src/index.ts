import { registerdUserConfig } from './config/useConfig.js';

import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const {
    registerUserConfig,
    registerTask,
    context,
  } = api;

  const { userConfig } = context;

  registerUserConfig(registerdUserConfig);

  (userConfig?.transform?.formats || ['esm', 'es2017']).forEach((format) => {
    registerTask(`${format}`, {
      type: 'transform',
    });
  });

  if (userConfig?.bundle) {
    const bundleTasks = (userConfig?.bundle?.formats || ['esm', 'es2017']);
    if (bundleTasks.includes('umd') || bundleTasks.includes('esm')) {
      registerTask('dist-es5', {
        type: 'bundle',
      });
    }

    if (bundleTasks.includes('es2017')) {
      registerTask('dist-es2017', {
        type: 'bundle',
      });
    }
  }
};

export default plugin;
