import { registerdUserConfig } from './config/useConfig.js';

import type { ComponentPlugin } from '@ice/pkg';

const plugin: ComponentPlugin = (api) => {
  const {
    registerUserConfig,
    registerTask,
    context,
  } = api;

  const { userConfig } = context;

  // @ts-ignore
  registerUserConfig(registerdUserConfig);


  // FIXME: default value is not valid when `registerTask` ?
  (userConfig?.transform?.formats || ['esm', 'es2017']).forEach((format) => {
    registerTask(`pkg-${format}`, {
      type: 'transform',
    });
  });

  // registerTask('component-esnext', {
  //   type: 'transform',
  // });

  // registerTask('component-es', {
  //   type: 'transform',
  // });

  // userConfig.lib && registerTask('component-lib', {
  //   type: 'transform',
  // });

  // userConfig.umd && registerTask('component-dist', {
  //   type: 'bundle',
  // });
};

export default plugin;
