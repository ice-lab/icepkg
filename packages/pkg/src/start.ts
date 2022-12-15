import consola from 'consola';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { createWatcher } from './helpers/watcher.js';
import { debouncePromise } from './utils.js';
import { buildAll } from './buildAll.js';

import type { BundleTaskLoaderConfig, PkgContext, TaskLoaderConfig, TransformTaskLoaderConfig } from './types.js';
import { watchBundleTasks } from './loaders/bundle.js';

const debouncedBuildAll = debouncePromise(
  async (cfgArrs: TaskLoaderConfig[], ctx: PkgContext) => {
    return await buildAll(cfgArrs, ctx);
  },
  100,
  (err) => {
    consola.error(err);
  },
);

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

  // const outputResults = await buildAll(normalizedConfigs, context);
  const outputResults = [];
  const {
    handleChange: handleBundleChange,
    outputResults: bundleOutputResults,
  } = await watchBundleTasks(
    normalizedConfigs.filter((config) => config.type === 'bundle') as BundleTaskLoaderConfig[],
    context,
  );
  // const {
  //   handleChange: handleTransformChange,
  //   outputResults: transformOutputResults,
  // } = watchTransform(normalizedConfigs.filter((config) => config.type === 'transform') as TransformTaskLoaderConfig[]);

  outputResults.push(...bundleOutputResults);
  console.log('outputResults====>', outputResults);
  await applyHook('after.start.compile', outputResults);

  const watcher = createWatcher(context);

  async function handleChange(id: string, event: 'create' | 'update' | 'delete') {
    // const newOutputResults = await debouncedBuildAll(normalizedConfigs, context);
    const newOutputResults = [];

    const newBundleOutputResults = await handleBundleChange(id, event);

    newOutputResults.push(...newBundleOutputResults);

    await applyHook('after.start.compile', newOutputResults);
  }

  watcher.on('add', async (id) => await handleChange(id, 'create'));
  watcher.on('change', async (id) => await handleChange(id, 'update'));
  watcher.on('unlink', async (id) => await handleChange(id, 'delete'));

  watcher.on('error', (err) => {
    consola.error(err);
  });
}
