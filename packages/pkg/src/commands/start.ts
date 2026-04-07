import { consola } from 'consola';
import { createBatchChangeHandler, createWatcher } from '../helpers/watcher.js';
import type { OutputResult, Context, WatchChangedFile, BuildTask } from '../types.js';
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
  batchHandler.beginBlock();

  watcher.on('add', (id) => batchHandler.onChange(id, 'create'));
  watcher.on('change', (id) => batchHandler.onChange(id, 'update'));
  watcher.on('unlink', (id) => batchHandler.onChange(id, 'delete'));
  watcher.on('error', (error) => consola.error(error));

  const tasks = getTaskRunners(buildTasks, context, watcher);

  const terminal = createRunnerReporter();
  const taskGroup = new RunnerScheduler(tasks, terminal);

  const outputResults: OutputResult[] = await taskGroup.run();

  await applyHook('after.start.compile', outputResults);

  await devServer?.listen();
  devServer?.printUrls();
  batchHandler.endBlock();

  async function runChangedCompile(changedFiles: WatchChangedFile[]) {
    try {
      const newOutputResults: OutputResult[] = await taskGroup.run(changedFiles);

      await applyHook('after.start.compile', newOutputResults);
    } catch (error) {
      consola.error(error);
    }
  }

  return watcher;
}
