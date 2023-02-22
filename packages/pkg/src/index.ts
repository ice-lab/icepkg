import { Service } from 'build-scripts';
import build from './commands/build.js';
import start from './commands/start.js';
import test from './commands/test.js';
import { getDefineJestConfigFunc, getDefineVitestConfigFunc } from './test/index.js';

import type { TaskConfig, UserConfig } from './types.js';

const pkgService = new Service<TaskConfig, {}, UserConfig>({
  name: 'pkgService',
  command: {
    build,
    start,
    test,
  },
});

const defineJestConfig = getDefineJestConfigFunc(pkgService);
const defineVitestConfig = getDefineVitestConfigFunc(pkgService);

// export {
//   defineJestConfig,
//   defineVitestConfig,
// };

export default pkgService;

export * from './types.js';

export { getBuiltInPlugins } from './utils.js';

export { defineConfig } from './defineConfig.js';
