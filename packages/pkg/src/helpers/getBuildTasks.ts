import deepmerge from 'deepmerge';
import { formatEntry, getDefaultEntryDir, getOutputDir } from './getTaskIO.js';
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

  // Configure task outputDir
  config.outputDir = config.outputDir || getOutputDir(rootDir, taskName);

  // Configure define
  config.define = stringifyObject(config.define || {});

  config.sourcemap = config.sourcemap ?? command === 'start';

  if (config.type === 'bundle') {
    config.entry = formatEntry(config.entry);
    config.swcCompileOptions = deepmerge(
      getDefaultBundleSwcConfig(config, context, taskName),
      config.swcCompileOptions || {},
    );
  } else if (config.type === 'transform') {
    config.entry = getDefaultEntryDir(rootDir);
    config.swcCompileOptions = deepmerge(
      getDefaultTransformSwcConfig(config, context, taskName),
      config.swcCompileOptions || {},
    );
    config.modes = [command === 'build' ? 'production' : 'development'];
  } else {
    throw new Error('Invalid task type.');
  }

  return buildTask;
}
