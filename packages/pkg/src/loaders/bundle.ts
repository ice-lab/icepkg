import { join } from 'path';
import * as rollup from 'rollup';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { BundleTaskLoaderConfig, HandleChange, HandleChanges, OutputFile, OutputResult, PkgContext } from '../types.js';
import type { OutputChunk as RollupOutputChunk, OutputAsset as RollupOutputAsset, RollupWatcherEvent, RollupBuild, RollupOutput, RollupOptions, OutputOptions } from 'rollup';
import EventEmitter from 'events';

export async function watchBundleTasks(
  taskLoaderConfigs: BundleTaskLoaderConfig[],
  ctx: PkgContext,
) {
  const handleChangeFunctions: HandleChange[] = [];
  const outputResults = [];

  for (const taskLoaderConfig of taskLoaderConfigs) {
    const { outputResult, handleChange } = await rawWatch(taskLoaderConfig, 'production');
    handleChangeFunctions.push(handleChange);
    outputResults.push(outputResult);

    // Apply dev build if bundle.development is true.
    if (ctx.userConfig.bundle?.development) {
      const { outputResult: devOutputResult, handleChange: devHandleChange } = await rawWatch(taskLoaderConfig, 'development');
      handleChangeFunctions.push(devHandleChange);
      outputResults.push(devOutputResult);
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
}

export async function buildBundleTasks(
  taskLoaderConfigs: BundleTaskLoaderConfig[],
  ctx: PkgContext,
) {
  const outputResults = [];

  for (const taskLoaderConfig of taskLoaderConfigs) {
    const { outputResult } = await rawBuild(taskLoaderConfig, 'production');
    outputResults.push(outputResult);

    // Apply dev build if bundle.development is true.
    if (ctx.userConfig.bundle?.development) {
      const { outputResult: devOutputResult } = await rawBuild(taskLoaderConfig, 'development');
      outputResults.push(devOutputResult);
    }
  }

  return {
    outputResults,
  };
}

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
  taskLoaderConfig: BundleTaskLoaderConfig,
  mode: 'development' | 'production',
): Promise<{ handleChange: HandleChange; outputResult: OutputResult }> {
  taskLoaderConfig.mode = mode;
  const { rollupOptions, name: taskName } = taskLoaderConfig;
  const rollupOutputOptions = toArray(rollupOptions.output);

  const emitter = new WatchEmitter();
  const watcher = new Watcher(
    [{ ...rollupOptions, watch: { skipWrite: false } }],
    emitter,
  );
  for (const task of watcher.tasks) {
    // Disable rollup chokidar watch service.
    await task.fileWatcher.watcher.close();
  }
  let result;
  const resolves = [];
  emitter.on('event', async (event: RollupWatcherEvent) => {
    if (event.code === 'BUNDLE_END' || event.code === 'ERROR') {
      const { result: { write, cache } } = event;
      const buildResult = await writeFile(rollupOutputOptions, write);
      result = {
        taskName,
        modules: cache.modules,
        ...buildResult,
      };
      let resolve;
      // eslint-disable-next-line no-cond-assign
      while (resolve = resolves.shift()) {
        resolve(result);
      }
      result = null;
    }
  });

  const getOutputResult = (): Promise<OutputResult> => {
    if (result) {
      return Promise.resolve(result);
    } else {
      return new Promise((resolve) => {
        resolves.push(resolve);
      });
    }
  };

  const handleChange: HandleChange = async (id: string, event: string) => {
    taskLoaderConfig.mode = mode;
    for (const task of watcher.tasks) {
      task.invalidate(id, {
        event,
        isTransformDependency: false,
      });
    }

    return getOutputResult();
  };

  const outputResult = await getOutputResult();

  return {
    handleChange,
    outputResult,
  };
}

async function rawBuild(taskLoaderConfig: BundleTaskLoaderConfig, mode: 'development' | 'production'): Promise<{ outputResult: OutputResult }> {
  taskLoaderConfig.mode = mode;

  const { rollupOptions, name: taskName } = taskLoaderConfig;
  const rollupOutputOptions = toArray(rollupOptions.output);

  const bundle = await rollup.rollup(rollupOptions);

  const buildResult = await writeFile(rollupOutputOptions, bundle.write);

  await bundle.close();

  return {
    outputResult: {
      taskName,
      modules: bundle.cache.modules,
      ...buildResult,
    },
  };
}

async function writeFile(rollupOutputOptions: OutputOptions[], write: RollupBuild['write']): Promise<Omit<OutputResult, 'taskName' | 'modules'>> {
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
