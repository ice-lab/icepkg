import * as config from '../config/index.js';
import { TaskName, UserConfig } from '../types.js';
import type { Plugin } from '../types.js';

const plugin: Plugin = (api) => {
  const {
    registerUserConfig,
    registerCliOption,
    registerTask,
    context,
  } = api;

  const userConfig = context.userConfig as UserConfig;

  registerUserConfig(config.getUserConfig());
  registerCliOption(config.getCliOptions());
  const transformFormats = userConfig.transform?.formats || ['esm', 'es2017'];
  // TODO: Move default value to userConfig defaultValue
  transformFormats.forEach((format) => {
    registerTask(`transform-${format}`, {
      type: 'transform',
    });
  });

  if (userConfig.bundle) {
    const bundleTasks = (userConfig.bundle?.formats || ['esm', 'es2017']);
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

  if ((userConfig.declaration ?? true) && transformFormats.length) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    registerTask(TaskName.DECLARATION, {
      type: 'declaration',
      transformFormats,
    });
  }
};

export default plugin;
