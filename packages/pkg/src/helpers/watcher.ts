import * as chokidar from 'chokidar';
import { toArray, unique } from '../utils.js';
import { createLogger } from './logger.js';

import type { ComponentConfig } from '../types';

export const createWatcher = (cfgs: ComponentConfig[]) => {
  const logger = createLogger('watcher');
  const inputs = unique(cfgs.map((cfg) => cfg.entry));
  const outputs = unique(cfgs.map((cfg) => cfg.outputDir));

  const ignoredPaths = [
    '**/{.git,node_modules}/**',
    ...outputs,
  ];

  const watchPaths = inputs;

  logger.info('COMPILE', `Watching for changes of paths ${
    toArray(watchPaths).map((p) => `"${p}"`).join(' | ')
  }`);

  const watcher = chokidar.watch(watchPaths, {
    ignored: ignoredPaths,
    ignoreInitial: true,
    ignorePermissionErrors: true, // Prevent permission errors
  });

  return watcher;
};
