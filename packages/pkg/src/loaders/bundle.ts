import { join } from 'path';
import * as rollup from 'rollup';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { BundleTaskLoaderConfig, HandleChange, OutputFile, OutputResult, PkgContext } from '../types.js';
import type { OutputChunk as RollupOutputChunk, OutputAsset as RollupOutputAsset, RollupWatcherEvent, RollupBuild, RollupOutput, RollupOptions } from 'rollup';
import EventEmitter from 'events';

interface RawBuildResult {
  bundle: RollupBuild;
  outputs: Array<RollupOutput['output']>;
  outputFiles: OutputFile[];
}

async function runBundle(config: BundleTaskLoaderConfig, ctx: PkgContext): Promise<OutputResult> {
  const { rollupOptions, name } = config;
  const { command, applyHook } = ctx;
  const logger = createLogger(name);
  const bundleStart = performance.now();
  const outputs = [];
  const outputFiles = [];
  const modules = [];

  logger.debug('Build start...');

  if (command === 'start') {
    // rawWatch(rollupOptions);
  } else {
    // Prod build.
    // eslint-disable-next-line no-param-reassign
    config.mode = 'production';
    const buildResult = await rawBuild(rollupOptions);
    buildResult.outputs.forEach((o) => outputs.push(o));
    buildResult.outputFiles.forEach((o) => outputFiles.push(o));
    buildResult.bundle.cache.modules.forEach((o) => modules.push(o));

    // Apply dev build if bundle.development is true.
    if (ctx.userConfig.bundle?.development) {
      // eslint-disable-next-line no-param-reassign,require-atomic-updates
      config.mode = 'development';
      const devBuildResult = await rawBuild(rollupOptions);
      devBuildResult.outputs.forEach((o) => outputs.push(o));
      devBuildResult.outputFiles.forEach((o) => outputFiles.push(o));
      devBuildResult.bundle.cache.modules.forEach((o) => modules.push(o));
    }

    logger.info(`✅ ${timeFrom(bundleStart)}`);
  }

  return {
    taskName: config.name,
    outputFiles,
    outputs,
    modules,
  };
}

export async function watchBundleTasks(
  taskLoaderConfigs: BundleTaskLoaderConfig[],
  ctx: PkgContext,
) {
  const handleChangeFunctions: HandleChange[] = [];
  const outputResults = [];

  for (const taskLoaderConfig of taskLoaderConfigs) {
    // const { rollupOptions, name: taskName } = taskLoaderConfig;
    // taskLoaderConfig.mode = 'production';
    const { outputResult, handleChange } = await rawWatch(taskLoaderConfig, 'production');
    handleChangeFunctions.push(handleChange);
    outputResults.push(outputResult);

    // Apply dev build if bundle.development is true.
    if (ctx.userConfig.bundle?.development) {
      taskLoaderConfig.mode = 'development';
      const { outputResult: devOutputResult, handleChange: devHandleChange } = await rawWatch(taskLoaderConfig, 'development');
      handleChangeFunctions.push(devHandleChange);
      outputResults.push(devOutputResult);
    }
  }

  async function handleChanges(id: string, event: string) {
    const newOutputResults: OutputResult[] = [];
    for (const handleChangeFunction of handleChangeFunctions) {
      const newOutputResult = await handleChangeFunction(id, event);
      newOutputResults.push(newOutputResult);
    }

    return newOutputResults;
  }

  return {
    handleChange: handleChanges,
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
}

async function rawWatch(taskLoaderConfig: BundleTaskLoaderConfig, mode: 'development' | 'production') {
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

  const getOutputResult = (outputOptions: Array<RollupOptions['output']>): Promise<OutputResult> => {
    return new Promise((resolve) => {
      emitter.on('event', async (event: RollupWatcherEvent) => {
        if (event.code === 'BUNDLE_END' || event.code === 'ERROR') {
          const { result: { write, cache } } = event;
          const buildResult = await writeFile(outputOptions, write);
          resolve({
            taskName,
            modules: cache.modules,
            ...buildResult,
          });
        }
      });
    });
  };

  const handleChange: HandleChange = async (id: string, event: string) => {
    console.log('invalidate ===>', id);
    taskLoaderConfig.mode = mode;
    for (const task of watcher.tasks) {
      task.invalidate(id, {
        event,
        isTransformDependency: false,
      });
    }

    return getOutputResult(rollupOutputOptions);
  };

  const outputResult = await getOutputResult(rollupOutputOptions);

  return {
    handleChange,
    outputResult,
  };
}

async function writeFile(rollupOutputOptions: any, write: RollupBuild['write']): Promise<Omit<OutputResult, 'taskName' | 'modules'>> {
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
async function rawBuild(rollupOptions: RollupOptions): Promise<RawBuildResult> {
  const bundle = await rollup.rollup(rollupOptions);

  const rollupOutputOptions = toArray(rollupOptions.output);
  const outputFiles: OutputFile[] = [];
  const outputs: Array<RollupOutput['output']> = [];
  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(rollupOutputOptions[o]);
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

  await bundle.close();
  return {
    bundle,
    outputs,
    outputFiles,
  };
}

export default runBundle;
