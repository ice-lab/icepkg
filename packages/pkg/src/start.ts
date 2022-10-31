import consola from 'consola';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { createWatcher } from './helpers/watcher.js';
import { debouncePromise } from './utils.js';
import { buildAll } from './buildAll.js';

import type { PkgContext, TaskLoaderConfig } from './types.js';

const debouncedBuildAll = debouncePromise(
  async (cfgArrs: TaskLoaderConfig[], ctx: PkgContext) => {
    return await buildAll(cfgArrs, ctx);
  },
  100,
  (err) => {
    consola.error(err);
  },
);

export default async (context: PkgContext) => {
  const { getConfig, applyHook, commandArgs } = context;

  const configs = getConfig();
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

  const outputResults = await buildAll(normalizedConfigs, context);

  const wather = createWatcher(normalizedConfigs);
  await applyHook('after.start.compile', outputResults);

  wather.on('change', async () => {
    const newOutputResults = await debouncedBuildAll(normalizedConfigs, context);

    await applyHook('after.start.compile', newOutputResults);
  });

  wather.on('error', (err) => {
    consola.error(err);
  });
};
