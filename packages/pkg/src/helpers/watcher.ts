import * as chokidar from 'chokidar';
import { getEntryItems, toArray, unique } from '../utils.js';
import { createLogger } from './logger.js';

import type { TaskConfig } from '../types';

export const createWatcher = (taskConfigs: TaskConfig[]) => {
  const logger = createLogger('watcher');
  let inputs: string[] = [];
  taskConfigs.forEach((cfg) => {
    inputs.push(...getEntryItems(cfg.entry));
  });
  inputs = unique(inputs);
  const outputs = unique(taskConfigs.map((cfg) => cfg.outputDir));

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
