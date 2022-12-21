import * as chokidar from 'chokidar';
import type { Context } from '../types';

export const createWatcher = (ctx: Context) => {
  const { rootDir } = ctx;
  const watcher = chokidar.watch(['src'], {
    cwd: rootDir,
    ignoreInitial: true,
    ignorePermissionErrors: true, // Prevent permission errors
  });

  return watcher;
};
