import { join } from 'path';
import consola from 'consola';
import * as rollup from 'rollup';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';
import EventEmitter from 'events';
import type {
  HandleChange,
  OutputFile,
  OutputResult,
  RunTasks,
  TaskRunnerContext,
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

export const runBundleWatchTasks: RunTasks = async (taskOptions) => {
  const handleChangeFunctions: HandleChange[] = [];
  const outputResults = [];

  for (const taskOption of taskOptions) {
    const [rollupOptions, taskRunnerContext] = taskOption;
    const { outputResult, handleChange } = await rawWatch(rollupOptions, taskRunnerContext);
    outputResults.push(outputResult);
    handleChangeFunctions.push(handleChange);
  }

  const handleChange: HandleChange<OutputResult[]> = async (id, event) => {
    const newOutputResults: OutputResult[] = [];
    for (const handleChangeFunction of handleChangeFunctions) {
      const newOutputResult = await handleChangeFunction(id, event);
      newOutputResults.push(newOutputResult);
    }

    return newOutputResults;
  };

  return {
    handleChange,
    outputResults,
  };
};

export const runBundleBuildTasks: RunTasks = async (taskOptions) => {
  const outputResults: OutputResult[] = [];

  for (const taskOption of taskOptions) {
    const [rollupOptions, taskRunnerContext] = taskOption;
    const { outputResult } = await rawBuild(rollupOptions, taskRunnerContext);
    outputResults.push(outputResult);
  }
  return { outputResults };
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
  taskRunnerContext: TaskRunnerContext,
): Promise<{ handleChange: HandleChange; outputResult: OutputResult }> {
  const rollupOutputOptions = toArray(rollupOptions.output);
  const { mode, buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const logger = createLogger(`${taskName}-${mode}`);

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
  const executors = [];
  emitter.on('event', async (event: RollupWatcherEvent) => {
    if (event.code === 'ERROR') {
      result = new Error(event.error.stack);
      let executor;
      // eslint-disable-next-line no-cond-assign
      while (executor = executors.shift()) {
        const [, reject] = executor;
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
      let executor;
      // eslint-disable-next-line no-cond-assign
      while (executor = executors.shift()) {
        const [resolve] = executor;
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
        executors.push([resolve, reject]);
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
  taskRunnerContext: TaskRunnerContext,
): Promise<{ outputResult: OutputResult }> {
  const rollupOutputOptions = toArray(rollupOptions.output);
  const { mode, buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const logger = createLogger(`${taskName}-${mode}`);

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
