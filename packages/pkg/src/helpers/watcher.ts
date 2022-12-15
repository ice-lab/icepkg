import * as chokidar from 'chokidar';
import type { PkgContext } from '../types';

export const createWatcher = (ctx: PkgContext) => {
  const { rootDir } = ctx;
  const watcher = chokidar.watch(['src'], {
    cwd: rootDir,
    ignoreInitial: true,
    ignorePermissionErrors: true, // Prevent permission errors
  });

  return watcher;
};
