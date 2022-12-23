import * as chokidar from 'chokidar';
import { unique } from '../utils.js';
import type { TaskConfig } from '../types.js';

export const createWatcher = (taskConfigs: TaskConfig[]) => {
  const outputs = unique(taskConfigs.map((taskConfig) => taskConfig.outputDir));

  const watcher = chokidar.watch([], {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      ...outputs,
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true, // Prevent permission errors
  });

  return watcher;
};
