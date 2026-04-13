import { consola } from 'consola';
import { createBatchChangeHandler, createWatcher } from '../helpers/watcher.js';
import type {
  OutputResult,
  Context,
  WatchChangedFile,
  BuildTask,
  StartCommandHandle,
  StartCloseReason,
} from '../types.js';
import { createRunnerReporter } from '../helpers/runnerReporter.js';
import { getTaskRunners } from '../helpers/getTaskRunners.js';
import { RunnerScheduler } from '../helpers/runnerScheduler.js';
import { createServer } from '../server/createServer.js';

export default async function start(context: Context) {
  const { applyHook, commandArgs, userConfig } = context;

  const buildTasks = context.getTaskConfig() as BuildTask[];
  const taskConfigs = buildTasks.map(({ config }) => config);

  await applyHook('before.start.load', {
    args: commandArgs,
    config: taskConfigs,
  });

  if (!taskConfigs.length) {
    throw new Error("Could not Find any pending tasks when executing 'start' command.");
  }

  await applyHook('before.start.run', {
    args: commandArgs,
    config: taskConfigs,
  });

  const watcher = createWatcher(taskConfigs);
  const serverConfig = commandArgs.server !== undefined ? commandArgs.server : userConfig.server;
  const devServer = serverConfig
    ? createServer({
        ...(serverConfig === true ? {} : serverConfig),
        ...(commandArgs.port ? { port: commandArgs.port } : {}),
        ...(commandArgs.host ? { host: commandArgs.host } : {}),
      })
    : null;
  const batchHandler = createBatchChangeHandler(runChangedCompile);
  const tasks = getTaskRunners(buildTasks, context, watcher);
  const terminal = createRunnerReporter();
  const taskGroup = new RunnerScheduler(tasks, terminal);
  let runningCompile: Promise<unknown> | null = null;
  let disposed = false;
  let disposePromise: Promise<void> | null = null;

  function trackCompile<T>(compileTask: Promise<T>): Promise<T> {
    const tracked = compileTask.finally(() => {
      runningCompile = null;
    });
    runningCompile = tracked.catch(() => {});
    return tracked;
  }

  async function dispose(reason: StartCloseReason) {
    if (disposePromise) {
      return disposePromise;
    }

    disposePromise = (async () => {
      if (disposed) {
        return;
      }
      disposed = true;
      await runningCompile;
      await applyHook('before.start.close', reason);
      await taskGroup?.close();
      await watcher.close();
      await devServer?.close();
    })();

    return disposePromise;
  }

  batchHandler.beginBlock();

  watcher.on('add', (id) => batchHandler.onChange(id, 'create'));
  watcher.on('change', (id) => batchHandler.onChange(id, 'update'));
  watcher.on('unlink', (id) => batchHandler.onChange(id, 'delete'));
  watcher.on('error', (error) => consola.error(error));

  const outputResults: OutputResult[] = await trackCompile(taskGroup.run());

  await applyHook('after.start.compile', outputResults);

  await devServer?.listen();
  devServer?.printUrls();
  batchHandler.endBlock();

  async function runChangedCompile(changedFiles: WatchChangedFile[]) {
    if (disposed) {
      return;
    }

    try {
      const newOutputResults: OutputResult[] = await trackCompile(taskGroup.run(changedFiles));

      await applyHook('after.start.compile', newOutputResults);
    } catch (error) {
      consola.error(error);
    }
  }

  const runtimeHandle: StartCommandHandle = {
    watcher,
    dispose,
  };

  return runtimeHandle;
}
