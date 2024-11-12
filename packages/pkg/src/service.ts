import { Service } from 'build-scripts';
import type { TaskConfig, UserConfig } from './types';
import build from './commands/build.js';
import start from './commands/start.js';
import test from './commands/test.js';

export const pkgService = new Service<TaskConfig, {}, UserConfig>({
  name: 'pkgService',
  command: {
    build,
    start,
    test,
  },
});
