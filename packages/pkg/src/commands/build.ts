import fse from 'fs-extra';
import { getBuildTasks } from '../helpers/getBuildTasks.js';
import type { Context, OutputResult } from '../types.js';
import { RunnerLinerTerminalReporter } from '../helpers/runnerReporter.js';
import { getTaskRunners } from '../helpers/getTaskRunners.js';
import { RunnerScheduler } from '../helpers/runnerScheduler.js';

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

  const tasks = getTaskRunners(buildTasks, context);

  try {
    const terminal = new RunnerLinerTerminalReporter();
    const taskGroup = new RunnerScheduler(tasks, terminal);

    const results = taskGroup.run();
    const outputResults: OutputResult[] = await results;

    await applyHook('after.build.compile', outputResults);
  } catch (err) {
    await applyHook('error', {
      errCode: 'COMPILE_ERROR',
      err,
    });

    throw err;
  }
}
