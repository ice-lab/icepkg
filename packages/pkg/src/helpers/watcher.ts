import * as chokidar from 'chokidar';
import { unique } from '../utils.js';
import type { TaskConfig, WatchChangedFile, WatchEvent } from '../types.js';

const WATCH_INTERVAL = 250;

type WatchCallback = (changedFiles: WatchChangedFile[]) => (Promise<void>);

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

export function createBatchChangeHandler(changeCallback: WatchCallback) {
  let nextChangedFiles: WatchChangedFile[] = [];
  let runningTask: Promise<void> | null = null;
  let enableBatch = false;
  let timer: any = 0;

  async function onChange(id: string, event: WatchEvent) {
    nextChangedFiles.push({ path: id, event });
    if (enableBatch) {
      return;
    }
    tryRunTask();
  }

  function tryRunTask() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      runTask();
      timer = null;
    }, WATCH_INTERVAL);
  }

  function runTask() {
    if (!nextChangedFiles.length) {
      return;
    }

    if (!runningTask) {
      const changedFiles = nextChangedFiles;
      nextChangedFiles = [];
      const task = changeCallback(changedFiles);
      runningTask = task.finally(() => {
        runningTask = null;
        tryRunTask();
      });
    }
  }


  return {
    /**
     * Block and cache file changes event, do not trigger change handler
     */
    beginBlock() {
      enableBatch = true;
    },
    /**
     * Trigger change handler since beginBlock
     */
    endBlock() {
      enableBatch = false;
      tryRunTask();
    },
    onChange,
  };
}
