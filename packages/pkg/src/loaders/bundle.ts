import { join } from 'path';
import consola from 'consola';
import * as rollup from 'rollup';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';
import EventEmitter from 'events';
import type {
  BundleTaskLoaderConfig,
  HandleChange,
  HandleChanges,
  NodeEnvMode,
  OutputFile,
  OutputResult,
  PkgContext,
  ReverseMap,
  RunLoaderTasks,
  TaskName,
} from '../types.js';
import type {
  OutputChunk as RollupOutputChunk,
  OutputAsset as RollupOutputAsset,
  RollupWatcherEvent,
  RollupBuild,
  RollupOutput,
  OutputOptions,
  RollupOptions,
} from 'rollup';

export const runBundleWatchTasks: RunLoaderTasks<BundleTaskLoaderConfig> = async (
  taskLoaderConfigs: BundleTaskLoaderConfig[],
) => {
  const handleChangeFunctions: HandleChange[] = [];
  const outputResults = [];

  for (const taskLoaderConfig of taskLoaderConfigs) {
    for (const rollupOptions of taskLoaderConfig.rollupOptions) {
      const { outputResult, handleChange } = await rawWatch(rollupOptions, taskLoaderConfig.taskName);
      handleChangeFunctions.push(handleChange);
      outputResults.push(outputResult);
    }
  }

  const handleChanges: HandleChanges = async (id, event) => {
    const newOutputResults: OutputResult[] = [];
    for (const handleChangeFunction of handleChangeFunctions) {
      const newOutputResult = await handleChangeFunction(id, event);
      newOutputResults.push(newOutputResult);
    }

    return newOutputResults;
  };

  return {
    handleChanges,
    outputResults,
  };
};

export const runBundleBuildTasks: RunLoaderTasks<BundleTaskLoaderConfig> = async (
  taskLoaderConfigs: BundleTaskLoaderConfig[],
) => {
  const outputResults = [];

  for (const taskLoaderConfig of taskLoaderConfigs) {
    for (const rollupOptions of taskLoaderConfig.rollupOptions) {
      const { outputResult } = await rawBuild(rollupOptions, taskLoaderConfig.taskName);
      outputResults.push(outputResult);
    }
  }

  return {
    outputResults,
  };
};

// Fork from https://github.com/rollup/rollup/blob/v2.79.1/src/watch/WatchEmitter.ts
class WatchEmitter extends EventEmitter {
  private awaitedHandlers: any;
  constructor() {
    super();
    this.awaitedHandlers = Object.create(null);
    // Allows more than 10 bundles to be watched without
    // showing the `MaxListenersExceededWarning` to the user.
    this.setMaxListeners(Infinity);
  }
  // Will be overwritten by Rollup
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async close() { }
  emitAndAwait(event, ...args) {
    this.emit(event, ...args);
    return Promise.all(this.getHandlers(event).map((handler) => handler(...args)));
  }
  onCurrentAwaited(event, listener) {
    this.getHandlers(event).push(listener);
    return this;
  }
  removeAwaited() {
    this.awaitedHandlers = {};
    return this;
  }
  getHandlers(event) {
    // eslint-disable-next-line no-return-assign
    return this.awaitedHandlers[event] || (this.awaitedHandlers[event] = []);
  }
  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const handle = (...args) => {
      this.off(eventName, handle);
      return listener.apply(this, args);
    };
    return this.on(eventName, handle);
  }
}

async function rawWatch(
  rollupOptions: RollupOptions,
  taskName: ReverseMap<typeof TaskName>,
): Promise<{ handleChange: HandleChange; outputResult: OutputResult }> {
  const rollupOutputOptions = toArray(rollupOptions.output);

  const logger = createLogger(`${taskName}`); // TODO: add mode to the logger name

  const start = performance.now();

  logger.debug('Bundle start...');

  const emitter = new WatchEmitter();
  const watcher = new Watcher(
    [{ ...rollupOptions, watch: { skipWrite: false } }],
    emitter,
  );
  for (const task of watcher.tasks) {
    // Disable rollup chokidar watch service.
    await task.fileWatcher.watcher.close();
  }
  let result: Error | OutputResult | null;
  const resolves = [];
  const rejects = [];
  emitter.on('event', async (event: RollupWatcherEvent) => {
    if (event.code === 'ERROR') {
      result = new Error(event.error.stack);
      let reject;
      // eslint-disable-next-line no-cond-assign
      while (reject = rejects.shift()) {
        resolves.shift();
        reject(result);
      }
      result = null;
    } else if (event.code === 'BUNDLE_END') {
      const { result: { write, cache } } = event;
      const buildResult = await writeFiles(rollupOutputOptions, write);
      result = {
        taskName,
        modules: cache.modules,
        ...buildResult,
      };
      let resolve;
      // eslint-disable-next-line no-cond-assign
      while (resolve = resolves.shift()) {
        rejects.shift();
        resolve(result);
      }
      result = null;
    }
  });

  const getOutputResult = (): Promise<OutputResult> => {
    if (result instanceof Error) {
      return Promise.reject(result);
    } else if (result) {
      return Promise.resolve(result);
    } else {
      return new Promise((resolve, reject) => {
        resolves.push(resolve);
        rejects.push(reject);
      });
    }
  };

  const handleChange: HandleChange = async (id: string, event: string) => {
    const changeStart = performance.now();

    logger.debug('Bundle start...');

    for (const task of watcher.tasks) {
      task.invalidate(id, {
        event,
        isTransformDependency: false,
      });
    }

    const outputResult = await getOutputResult();

    logger.debug('Bundle end...');
    logger.info(`✅ ${timeFrom(changeStart)}`);

    return outputResult;
  };

  let outputResult: OutputResult;

  try {
    outputResult = await getOutputResult();
    logger.info(`✅ ${timeFrom(start)}`);
  } catch (error) {
    consola.error(error.stack);
  }

  logger.debug('Bundle end...');

  return {
    handleChange,
    outputResult,
  };
}

async function rawBuild(
  rollupOptions: RollupOptions,
  taskName: ReverseMap<typeof TaskName>,
): Promise<{ outputResult: OutputResult }> {
  const rollupOutputOptions = toArray(rollupOptions.output);
  const logger = createLogger(`${taskName}`);

  const start = performance.now();

  logger.debug('Bundle start...');

  const bundle = await rollup.rollup(rollupOptions);

  const buildResult = await writeFiles(rollupOutputOptions, bundle.write);

  await bundle.close();

  logger.debug('Bundle end...');
  logger.info(`✅ ${timeFrom(start)}`);

  return {
    outputResult: {
      taskName,
      modules: bundle.cache.modules,
      ...buildResult,
    },
  };
}

async function writeFiles(rollupOutputOptions: OutputOptions[], write: RollupBuild['write']): Promise<Omit<OutputResult, 'taskName' | 'modules'>> {
  const outputFiles: OutputFile[] = [];
  const outputs: Array<RollupOutput['output']> = [];

  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await write(rollupOutputOptions[o]);
    const distDir = rollupOutputOptions[o].dir;
    writeResult.output.forEach((chunk: RollupOutputChunk | RollupOutputAsset) => {
      outputFiles.push({
        absolutePath: chunk['facadeModuleId'],
        dest: join(distDir, chunk.fileName),
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
    outputs.push(writeResult.output);
  }

  return {
    outputs,
    outputFiles,
  };
}
