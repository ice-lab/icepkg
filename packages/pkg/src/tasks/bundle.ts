import * as path from 'path';
import { Watcher } from 'rollup/dist/shared/watch.js';
import { toArray } from '../utils.js';
import EventEmitter from 'node:events';
import type { EngineType, OutputResult, TaskRunnerContext, WatchChangedFile } from '../types.js';
import type { RollupWatcherEvent, RollupBuild, OutputOptions, RollupOptions, AwaitedEventListener } from 'rollup';
import type { FSWatcher } from 'chokidar';
import type { RslibConfig, rsbuild } from '@rslib/core';
import { getRollupOptions } from '../engine/rollup/options.js';
import { Runner } from '../helpers/runner.js';
import type { BuildOptions as RolldownBuildOptions } from 'rolldown';
import { noop } from 'es-toolkit';
import { consola } from 'consola';

export function createBundleTask(taskRunningContext: TaskRunnerContext) {
  return new BundleRunner(taskRunningContext);
}

export class BundleRunner extends Runner<OutputResult> {
  private rollupOptions?: RollupOptions;
  private rslibConfig?: RslibConfig;
  private rolldownOptions?: RolldownBuildOptions[];
  private engine: EngineType;
  private watcher: Watcher | null = null;
  private result: Error | OutputResult | null = null;
  private readonly executors: Array<
    [resolve: (value: OutputResult | PromiseLike<OutputResult>) => void, reject: (reason?: unknown) => void]
  > = [];
  constructor(taskRunningContext: TaskRunnerContext) {
    super(taskRunningContext);
    this.engine = taskRunningContext.buildTask.config.engine ?? 'rollup';
  }

  async doRun(changedFiles: WatchChangedFile[]): Promise<OutputResult> {
    switch (this.engine) {
      case 'rollup':
        return this.handleRollupBuild(changedFiles);
      case 'rslib':
        return this.handleRslibBuild(changedFiles);
      case 'rolldown':
        return this.handleRolldownBuild(changedFiles);
      default:
        throw new Error(`Unsupported engine: ${this.engine}`);
    }
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

  private async handleRollupBuild(changedFiles: WatchChangedFile[]): Promise<OutputResult> {
    const { context } = this;
    const { build: rawBuild, writeFiles } = await import('../engine/rollup/build.js');
    if (!this.rollupOptions) {
      this.rollupOptions = getRollupOptions(context.buildContext, context);
    }
    const { rollupOptions } = this;
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
        const rollupOutputOptions = toArray(rollupOptions.output).filter(Boolean) as OutputOptions[];
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
              modules: cache!.modules,
              ...buildResult,
            } as OutputResult;
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

  private async handleRslibBuild(changedFiles: WatchChangedFile[]): Promise<OutputResult> {
    const { context } = this;
    const { build: buildRslib, logger, rsbuild } = await import('@rslib/core');
    if (!this.rslibConfig) {
      const { getRslibConfig } = await import('../engine/rslib/config.js');
      this.rslibConfig = getRslibConfig(context.buildContext, context);

      // Hack: disable all logger
      logger.override({
        ready: noop,
        info: noop,
        warn: noop,
        error: noop,
        debug: noop,
        success: noop,
        log: noop,
      });
      rsbuild.logger.override({
        ready: noop,
        info: noop,
        warn: noop,
        error: noop,
        debug: noop,
        success: noop,
        log: noop,
      });
    }
    const { rslibConfig } = this;
    let resolve: (value: any) => void;
    const defer = new Promise<Parameters<rsbuild.OnAfterBuildFn>[0]>((res) => {
      resolve = res;
    });

    const statsPlugin: rsbuild.RsbuildPlugin = {
      name: 'icepkg-plugin-hook',
      setup(api) {
        api.onAfterBuild((result) => resolve(result));
      },
    };

    // TODO: wait 1.0 to correct handle error
    await buildRslib(
      {
        ...rslibConfig,
        plugins: [...(rslibConfig.plugins ?? []), statsPlugin],
      },
      {},
    );

    const result = await defer;

    const stats = result.stats?.toJson(true);

    if (!stats || stats?.errorsCount) {
      (stats?.errors || []).forEach((error: any) => {
        consola.error(error);
      });
      throw new Error(`Build error`);
    }

    return {
      taskName: context.buildTask.name,
      // TODO: correct type and value
      modules: stats?.modules as any,
      outputs: stats?.chunks as any,
      outputFiles: stats?.assets as any,
    } as OutputResult;
  }

  private async handleRolldownBuild(changedFiles: WatchChangedFile[]): Promise<OutputResult> {
    const { context } = this;
    const { build } = await import('../engine/rolldown/build.js');
    if (!this.rolldownOptions) {
      const { getRolldownOptions } = await import('../engine/rolldown/options.js');
      this.rolldownOptions = getRolldownOptions(context.buildContext, context);
    }
    return await build(this.rolldownOptions!, this.context);
  }

  override async close(): Promise<void> {
    await (this.watcher as { close?: () => Promise<void> } | null)?.close?.();
    this.watcher = null;
    this.result = null;
    this.executors.length = 0;
  }
}

// Fork from https://github.com/rollup/rollup/blob/v2.79.1/src/watch/WatchEmitter.ts
class WatchEmitter<T extends Record<string, (...parameters: unknown[]) => unknown>> extends EventEmitter {
  private currentHandlers: {
    [K in keyof T]?: Array<AwaitedEventListener<T, K>>;
  } = Object.create(null);
  private awaitedHandlers: unknown;
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
  emitAndAwait(event: string | symbol, ...args: unknown[]) {
    this.emit(event, ...(args as any[]));
    return Promise.all(
      this.getHandlers(event).map((handler) => {
        if (typeof handler === 'function') {
          return handler(...args);
        }
        return undefined;
      }),
    );
  }
  onCurrentAwaited(event: string | symbol, listener: (...args: unknown[]) => unknown) {
    this.getHandlers(event).push(listener);
    return this;
  }
  removeAwaited() {
    this.awaitedHandlers = {};
    return this;
  }
  getHandlers(event: string | symbol): Array<(...args: unknown[]) => unknown> {
    const map = this.awaitedHandlers as Record<string | symbol, Array<(...args: unknown[]) => unknown>>;
    const handlers = map[event];
    if (handlers) return handlers;
    return (map[event] = []);
  }
  override once(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
    const handle = (...args: unknown[]) => {
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
    const watchFiles: string[] = (result.watchFiles as string[] | undefined) ?? [];
    const modules = ((result.cache as any)?.modules as any[] | undefined) ?? [];

    for (const id of watchFiles) {
      this.watchFile(id);
    }

    for (const m of modules) {
      // TODO: support create TransformDependency watcher
      for (const depId of m.transformDependencies ?? []) {
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
