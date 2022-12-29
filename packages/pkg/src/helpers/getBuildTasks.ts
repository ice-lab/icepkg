import deepmerge from 'deepmerge';
import { getOutputDir, formatEntry } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { stringifyObject } from '../utils.js';

import type { Context, BuildTask } from '../types.js';

export function getBuildTasks(context: Context): BuildTask[] {
  const { getTaskConfig } = context;
  const buildTasks = getTaskConfig() as BuildTask[];
  return buildTasks.map((buildTask) => getBuildTask(buildTask, context));
}

function getBuildTask(buildTask: BuildTask, context: Context): BuildTask {
  const { rootDir, command } = context;
  const { config, name: taskName } = buildTask;

  config.entry = formatEntry(config.entry);
  // Configure task outputDir
  config.outputDir = config.outputDir || getOutputDir(rootDir, taskName);
  // Configure define
  config.define = stringifyObject(config.define || {});

  config.sourcemap = config.sourcemap ?? command === 'start';
  if (config.type === 'bundle') {
    config.swcCompileOptions = deepmerge(
      getDefaultBundleSwcConfig(config, context, taskName),
      config.swcCompileOptions || {},
    );
  } else if (config.type === 'transform') {
    const mode = command === 'build' ? 'production' : 'development';
    config.modes = [mode];
    config.swcCompileOptions = deepmerge(
      getDefaultTransformSwcConfig(config, context, taskName, mode),
      config.swcCompileOptions || {},
    );
  } else {
    throw new Error('Invalid task type.');
  }

  return buildTask;
}
