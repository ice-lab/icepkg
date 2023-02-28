import { Service } from 'build-scripts';
import build from './commands/build.js';
import start from './commands/start.js';
import test from './commands/test.js';

import type { TaskConfig, UserConfig } from './types.js';

const pkgService = new Service<TaskConfig, {}, UserConfig>({
  name: 'pkgService',
  command: {
    build,
    start,
    test,
  },
});

export default pkgService;

export * from './test/index.js';

export * from './types.js';

export { getBuiltInPlugins } from './utils.js';

export { defineConfig } from './defineConfig.js';
