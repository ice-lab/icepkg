import fse from 'fs-extra';
import { RollupOptions } from 'rollup';
import { getBuildTasks } from './helpers/getBuildTasks.js';
import { getRollupOptions } from './helpers/getRollupOptions.js';
import { buildBundleTasks } from './tasks/bundle.js';
import { buildTransformTasks } from './tasks/transform.js';

import type { Context, OutputResult, TaskRunnerContext } from './types.js';

export default async function build(context: Context) {
  const { applyHook, commandArgs } = context;

  const buildTasks = getBuildTasks(context);
  const taskConfigs = buildTasks.map(({ config }) => config);

  await applyHook('before.build.load', {
    args: commandArgs,
    config: taskConfigs,
  });

  if (!taskConfigs.length) {
    throw new Error('Could not Find any pending tasks when executing \'build\' command.');
  }

  await applyHook('before.build.run', {
    args: commandArgs,
    config: taskConfigs,
  });

  // Empty outputDir before run the task.
  const outputDirs = taskConfigs.map((config) => config.outputDir).filter(Boolean);
  outputDirs.forEach((outputDir) => fse.emptyDirSync(outputDir));

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

  try {
    const outputResults: OutputResult[] = [];
    const { outputResults: transformOutputResults } = await buildTransformTasks(
      transformOptions,
      context,
    );
    const { outputResults: bundleOutputResults } = await buildBundleTasks(
      bundleOptions,
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
