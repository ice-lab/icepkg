import consola from 'consola';
import { RollupOptions } from 'rollup';
import { getBuildTasks } from './helpers/getBuildTasks.js';
import { getRollupOptions } from './helpers/getRollupOptions.js';
import { createWatcher } from './helpers/watcher.js';
import { runBundleWatchTasks } from './tasks/bundle.js';
import { runTransformWatchTasks } from './tasks/transform.js';

import type {
  OutputResult,
  Context,
  WatchEvent,
  TaskRunnerContext,
} from './types.js';

export default async function start(context: Context) {
  const { applyHook, commandArgs } = context;

  const buildTasks = getBuildTasks(context);
  const taskConfigs = buildTasks.map(({ config }) => config);

  await applyHook('before.start.load', {
    args: commandArgs,
    config: taskConfigs,
  });

  if (!taskConfigs.length) {
    throw new Error('Could not Find any pending tasks when excuting \'start\' command.');
  }

  await applyHook('before.start.run', {
    args: commandArgs,
    config: taskConfigs,
  });

  const transformOptions = buildTasks
    .filter(({ config }) => config.type === 'transform')
    .map((buildTask) => {
      const { config: { modes } } = buildTask;
      return modes.map((mode) => {
        const taskRunnerContext: TaskRunnerContext = { mode, buildTask };
        const rollupOptions = getRollupOptions(context, taskRunnerContext);
        return [rollupOptions, taskRunnerContext] as [RollupOptions, TaskRunnerContext];
      });
    })
    .flat(1);

  const bundleOptions = buildTasks
    .filter(({ config }) => config.type === 'bundle')
    .map((buildTask) => {
      const { config: { modes } } = buildTask;
      return modes.map((mode) => {
        const taskRunnerContext: TaskRunnerContext = { mode, buildTask };
        const rollupOptions = getRollupOptions(context, taskRunnerContext);
        return [rollupOptions, taskRunnerContext] as [RollupOptions, TaskRunnerContext];
      });
    })
    .flat(1);

  const watcher = createWatcher(context);
  watcher.on('add', async (id) => await handleChange(id, 'create'));
  watcher.on('change', async (id) => await handleChange(id, 'update'));
  watcher.on('unlink', async (id) => await handleChange(id, 'delete'));
  watcher.on('error', (error) => consola.error(error));

  const outputResults: OutputResult[] = [];

  const transformWatchResult = await runTransformWatchTasks(
    transformOptions,
    context,
  );
  const bundleWatchResult = await runBundleWatchTasks(
    bundleOptions,
    context,
  );

  outputResults.push(
    ...(transformWatchResult.outputResults),
    ...(bundleWatchResult.outputResults),
  );

  await applyHook('after.start.compile', outputResults);

  async function handleChange(id: string, event: WatchEvent) {
    const newOutputResults = [];
    try {
      const newTransformOutputResults = transformWatchResult.handleChange ?
        await transformWatchResult.handleChange(id, event) :
        [];
      const newBundleOutputResults = bundleWatchResult.handleChange ?
        await bundleWatchResult.handleChange(id, event) :
        [];
      newOutputResults.push(
        ...newTransformOutputResults,
        ...newBundleOutputResults,
      );

      await applyHook('after.start.compile', newOutputResults);
    } catch (error) {
      consola.error(error);
    }
  }
}
