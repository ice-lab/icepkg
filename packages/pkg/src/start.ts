import consola from 'consola';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { createWatcher } from './helpers/watcher.js';
import { runBundleWatchTasks } from './loaders/bundle.js';
import { runTransformWatchTasks } from './loaders/transform.js';

import type { BundleTaskLoaderConfig, LoaderTaskResult, OutputResult, PkgContext, TransformTaskLoaderConfig, WatchEvent } from './types.js';

export default async function start(context: PkgContext) {
  const { getTaskConfig, applyHook, commandArgs } = context;

  const configs = getTaskConfig();
  await applyHook('before.start.load', { args: commandArgs, config: configs });

  if (!configs.length) {
    const err = new Error('Could not Find any pending tasks when excuting \'start\' command.');

    throw err;
  }

  await applyHook('before.start.run', {
    args: commandArgs,
    config: configs,
  });

  // @ts-ignore fixme
  const normalizedConfigs = configs.map((config) => mergeConfigOptions(config, context));

  const watcher = createWatcher(context);
  watcher.on('add', async (id) => await handleChange(id, 'create'));
  watcher.on('change', async (id) => await handleChange(id, 'update'));
  watcher.on('unlink', async (id) => await handleChange(id, 'delete'));
  watcher.on('error', (error) => consola.error(error));

  const bundleTaskLoaderConfigs = normalizedConfigs.filter((config) => config.type === 'bundle') as BundleTaskLoaderConfig[];
  const transformTaskLoaderConfigs = normalizedConfigs.filter((config) => config.type === 'transform') as TransformTaskLoaderConfig[];

  let bundleWatchResult: LoaderTaskResult = { outputResults: [] };
  let transformWatchResult: LoaderTaskResult = { outputResults: [] };

  const outputResults: OutputResult[] = [];

  if (transformTaskLoaderConfigs.length) {
    transformWatchResult = await runTransformWatchTasks(transformTaskLoaderConfigs, context);
  }
  if (bundleTaskLoaderConfigs.length) {
    bundleWatchResult = await runBundleWatchTasks(bundleTaskLoaderConfigs, context);
  }

  outputResults.push(
    ...(transformWatchResult.outputResults || []),
    ...(bundleWatchResult.outputResults || []),
  );

  await applyHook('after.start.compile', outputResults);

  async function handleChange(id: string, event: WatchEvent) {
    const newOutputResults = [];
    try {
      const newTransformOutputResults = transformWatchResult.handleChanges ?
        await transformWatchResult.handleChanges(id, event) :
        [];
      const newBundleOutputResults = bundleWatchResult.handleChanges ?
        await bundleWatchResult.handleChanges(id, event) :
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
