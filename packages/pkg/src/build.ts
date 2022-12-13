import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { buildAll } from './buildAll.js';

import type { PkgContext, PkgTaskConfig } from './types.js';

export default async (context: PkgContext) => {
  const { getConfig, applyHook, commandArgs } = context;

  const configs = getConfig();
  await applyHook('before.build.load', { args: commandArgs, config: configs });

  if (!configs.length) {
    throw new Error('Could not Find any pending tasks when executing \'build\' command.');
  }

  await applyHook('before.build.run', {
    args: commandArgs,
    config: configs,
  });

  const normalizedConfigs = configs.map((config) => mergeConfigOptions(config as PkgTaskConfig, context));

  try {
    const outputResults = await buildAll(normalizedConfigs, context);

    await applyHook('after.build.compile', outputResults);
  } catch (err) {
    await applyHook('error', {
      errCode: 'COMPILE_ERROR',
      err,
    });

    throw err;
  }
};
