import fse from 'fs-extra';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { buildAll } from './buildAll.js';

import type { PkgContext, PkgTaskConfig } from './types.js';

export default async (context: PkgContext) => {
  const { getTaskConfig, applyHook, commandArgs, command } = context;

  const configs = getTaskConfig();
  await applyHook('before.build.load', { args: commandArgs, config: configs });

  if (!configs.length) {
    throw new Error('Could not Find any pending tasks when executing \'build\' command.');
  }

  await applyHook('before.build.run', {
    args: commandArgs,
    config: configs,
  });

  const normalizedConfigs = configs.map((config) => mergeConfigOptions(config as PkgTaskConfig, context));

  if (command === 'build') {
    // Empty outputDir before run the task.
    const outputDirs = normalizedConfigs.map((config) => config.outputDir).filter(Boolean);
    outputDirs.forEach((outputDir) => fse.emptyDirSync(outputDir));
  }

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
