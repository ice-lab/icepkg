import fse from 'fs-extra';
import type { BuildTask, Context, OutputResult, BuildCloseReason } from '../types.js';
import { createRunnerReporter } from '../helpers/runnerReporter.js';
import { getTaskRunners } from '../helpers/getTaskRunners.js';
import { RunnerScheduler } from '../helpers/runnerScheduler.js';

export default async function build(context: Context) {
  const { applyHook, commandArgs } = context;
  let closePromise: Promise<void> | null = null;
  let error: unknown;
  let outputResults: OutputResult[] | undefined;

  async function dispose(reason: BuildCloseReason) {
    if (closePromise) {
      return closePromise;
    }
    closePromise = (async () => {
      await applyHook('before.build.close', reason);
      await taskGroup?.close();
    })();
    return closePromise;
  }

  const buildTasks = context.getTaskConfig() as BuildTask[];
  const taskConfigs = buildTasks.map(({ config }) => config);

  await applyHook('before.build.load', {
    args: commandArgs,
    config: taskConfigs,
  });

  if (!taskConfigs.length) {
    throw new Error("Could not Find any pending tasks when executing 'build' command.");
  }

  await applyHook('before.build.run', {
    args: commandArgs,
    config: taskConfigs,
  });

  const outputDirs = taskConfigs.map((config) => config.outputDir!).filter(Boolean);
  outputDirs.forEach((outputDir) => fse.emptyDirSync(outputDir));

  const tasks = getTaskRunners(buildTasks, context);
  const terminal = createRunnerReporter();
  const taskGroup = new RunnerScheduler(tasks, terminal);

  try {
    const results = taskGroup.run();
    outputResults = await results;

    await applyHook('after.build.compile', outputResults);
  } catch (err) {
    error = err;
    await applyHook('error', {
      errCode: 'COMPILE_ERROR',
      err,
    });
  }

  return {
    dispose,
    error,
    outputResults,
  };
}
