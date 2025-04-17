import * as path from 'path';
import * as rollup from 'rollup';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { toArray } from '../utils.js';
import EventEmitter from 'node:events';
import type { OutputFile, OutputResult, TaskRunnerContext, WatchChangedFile } from '../types.js';
import type {
  OutputChunk as RollupOutputChunk,
  OutputAsset as RollupOutputAsset,
  RollupWatcherEvent,
  RollupBuild,
  RollupOutput,
  OutputOptions,
  RollupOptions,
  AwaitedEventListener,
} from 'rollup';
import type { FSWatcher } from 'chokidar';
import { getRollupOptions } from '../helpers/getRollupOptions.js';
import { Runner } from '../helpers/runner.js';

export function createBundleTask(taskRunningContext: TaskRunnerContext) {
  return new BundleRunner(taskRunningContext);
}

export class BundleRunner extends Runner<OutputResult> {
  private rollupOptions: RollupOptions;
  private watcher: Watcher | null = null;
  private result: Error | OutputResult | null;
  private readonly executors = [];
  constructor(taskRunningContext: TaskRunnerContext) {
    super(taskRunningContext);
    this.rollupOptions = getRollupOptions(taskRunningContext.buildContext, taskRunningContext);
  }

  async doRun(changedFiles: WatchChangedFile[]): Promise<OutputResult> {
    const { rollupOptions, context } = this;
    if (context.watcher) {
      if (this.watcher) {
        for (const file of changedFiles) {
          for (const task of this.watcher.tasks) {
            task.invalidate(file.path, {
              event: file.event,
              isTransformDependency: false,
            });
          }
        }
      } else {
        const rollupOutputOptions = toArray(rollupOptions.output);
        const fileWatcher = new FileWatcher(context.watcher, rollupOutputOptions);
        const emitter = new WatchEmitter();
        const watcher = (this.watcher = new Watcher([{ ...rollupOptions, watch: { skipWrite: false } }], emitter));
        for (const task of watcher.tasks) {
          // Disable rollup chokidar watch service.
          await task.fileWatcher.watcher.close();
        }

        emitter.on('event', async (event: RollupWatcherEvent) => {
          if (event.code === 'ERROR') {
            this.result = new Error(event.error.stack);
            let executor;

            while ((executor = this.executors.shift())) {
              const [, reject] = executor;
              reject(this.result);
            }
            this.result = null;
          } else if (event.code === 'BUNDLE_END') {
            const { result: bundleResult } = event;
            const { write, cache } = bundleResult;
            fileWatcher.updateWatchedFiles(bundleResult);
            const buildResult = await writeFiles(rollupOutputOptions, write);
            this.result = {
              taskName: context.buildTask.name,
              modules: cache.modules,
              ...buildResult,
            };
            let executor;

            while ((executor = this.executors.shift())) {
              const [resolve] = executor;
              resolve(this.result);
            }
            this.result = null;
          }
        });
      }

      return this.getOutputResult();
    }
    return rawBuild(rollupOptions, context);
  }

  private getOutputResult(): Promise<OutputResult> {
    const { result, executors } = this;
    if (result instanceof Error) {
      return Promise.reject(result);
    } else if (result) {
      return Promise.resolve(result);
    } else {
      return new Promise((resolve, reject) => {
        executors.push([resolve, reject]);
      });
    }
  }
}

// Fork from https://github.com/rollup/rollup/blob/v2.79.1/src/watch/WatchEmitter.ts
class WatchEmitter<T extends Record<string, (...parameters: any) => any>> extends EventEmitter {
  private currentHandlers: {
    [K in keyof T]?: Array<AwaitedEventListener<T, K>>;
  } = Object.create(null);
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
  async close() {}
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
    return this.awaitedHandlers[event] || (this.awaitedHandlers[event] = []);
  }
  override once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const handle = (...args) => {
      this.off(eventName, handle);
      return listener.apply(this, args);
    };
    return this.on(eventName, handle);
  }
  onCurrentRun<K extends keyof T>(event: K, listener: AwaitedEventListener<T, K>): this {
    this.getCurrentHandlers(event).push(listener);
    return this;
  }
  removeListenersForCurrentRun(): this {
    this.currentHandlers = Object.create(null);
    return this;
  }
  private getCurrentHandlers<K extends keyof T>(event: K): Array<AwaitedEventListener<T, K>> {
    return this.currentHandlers[event] || (this.currentHandlers[event] = []);
  }
}

class FileWatcher {
  private watched = new Set<string>();
  private watcher: FSWatcher;
  private outputFiles: string[];
  constructor(watcher: FSWatcher, rollupOutputs: OutputOptions[]) {
    this.watcher = watcher;
    this.outputFiles = rollupOutputs.map((output) => {
      if (output.file || output.dir) return path.resolve(output.file || output.dir!);
      return undefined as never;
    });
  }
  updateWatchedFiles(result: RollupBuild) {
    const previouslyWatched = this.watched;
    this.watched = new Set<string>();
    const {
      watchFiles,
      cache: { modules },
    } = result;

    for (const id of watchFiles) {
      this.watchFile(id);
    }

    for (const module of modules) {
      // TODO: support create TransformDependency watcher
      for (const depId of module.transformDependencies) {
        this.watchFile(depId);
      }
    }

    for (const id of previouslyWatched) {
      if (!this.watched.has(id)) {
        this.unwatchFile(id);
      }
    }
  }
  private watchFile(id: string) {
    if (/node_modules/.test(id) || /\0/.test(id)) return;
    this.watched.add(id);

    if (this.outputFiles.includes(id)) {
      throw new Error('Cannot import the generated bundle');
    }

    this.watcher.add(id);
  }
  private unwatchFile(id: string): void {
    this.watcher.unwatch(id);
  }
}

async function rawBuild(rollupOptions: RollupOptions, taskRunnerContext: TaskRunnerContext): Promise<OutputResult> {
  const rollupOutputOptions = toArray(rollupOptions.output);
  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;

  const bundle = await rollup.rollup(rollupOptions);

  const buildResult = await writeFiles(rollupOutputOptions, bundle.write);

  await bundle.close();

  return {
    taskName,
    modules: bundle.cache.modules,
    ...buildResult,
  };
}

async function writeFiles(
  rollupOutputOptions: OutputOptions[],
  write: RollupBuild['write'],
): Promise<Omit<OutputResult, 'taskName' | 'modules'>> {
  const outputFiles: OutputFile[] = [];
  const outputs: Array<RollupOutput['output']> = [];

  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    const writeResult = await write(rollupOutputOptions[o]);
    const distDir = rollupOutputOptions[o].dir;
    writeResult.output.forEach((chunk: RollupOutputChunk | RollupOutputAsset) => {
      outputFiles.push({
        absolutePath: chunk['facadeModuleId'],
        dest: path.join(distDir, chunk.fileName),
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
