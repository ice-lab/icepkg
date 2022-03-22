import consola from 'consola';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { createWatcher } from './helpers/watcher.js';
import { debouncePromise } from './utils.js';
import { buildAll } from './buildAll.js';

import type { ComponentContext, ComponentConfig } from './types.js';

const debouncedBuildAll = debouncePromise(
  async (cfgArrs: ComponentConfig[], ctx: ComponentContext) => {
    await buildAll(cfgArrs, ctx);
  },
  100,
  (err) => {
    consola.error(err);
  },
);

export default async (context: ComponentContext) => {
  const { getConfig, applyHook, commandArgs } = context;

  const configs = getConfig();
  await applyHook('before.start.load', { args: commandArgs, config: configs });

  if (!configs.length) {
    const err = new Error('Could not Find any pending tasks when excuting \'start\' command.');

    await applyHook('error', {
      errCode: 'NO_CONFIG_FOUND',
      err,
    });

    throw err;
  }

  await applyHook('before.start.run', {
    args: commandArgs,
    config: configs,
  });

  const normalizedConfigs = configs.map((config) => mergeConfigOptions(config, context));

  await buildAll(normalizedConfigs, context);

  const wather = createWatcher(normalizedConfigs);
  await applyHook('after.start.compile');

  wather.on('change', async () => {
    await debouncedBuildAll(normalizedConfigs, context);

    await applyHook('after.start.compile');
  });

  wather.on('error', (err) => {
    consola.error(err);
  });
};