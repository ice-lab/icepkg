import fse from 'fs-extra';
import { mergeConfigOptions } from './helpers/mergeConfigOptions.js';
import { runBundleBuildTasks } from './loaders/bundle.js';
import { runTransformBuildTasks } from './loaders/transform.js';

import type { BundleTaskLoaderConfig, OutputResult, PkgContext, PkgTaskConfig, TransformTaskLoaderConfig } from './types.js';

export default async function build(context: PkgContext) {
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
    const outputResults: OutputResult[] = [];
    const { outputResults: transformOutputResults } = await runTransformBuildTasks(
      normalizedConfigs.filter((config) => config.type === 'transform') as TransformTaskLoaderConfig[],
      context,
    );
    const { outputResults: bundleOutputResults } = await runBundleBuildTasks(
      normalizedConfigs.filter((config) => config.type === 'bundle') as BundleTaskLoaderConfig[],
      context,
    );

    outputResults.push(
      ...bundleOutputResults,
      ...transformOutputResults,
    );

    await applyHook('after.build.compile', outputResults);
  } catch (err) {
    await applyHook('error', {
      errCode: 'COMPILE_ERROR',
      err,
    });

    throw err;
  }
}
