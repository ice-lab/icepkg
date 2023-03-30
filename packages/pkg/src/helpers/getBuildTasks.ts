import deepmerge from 'deepmerge';
import { formatEntry, getTransformDefaultOutputDir } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { stringifyObject } from '../utils.js';
import getDefaultDefineValues from './getDefaultDefineValues.js';

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
  // Configure define
  config.define = Object.assign(
    // Note: The define values in bundle mode will be defined (according to the `modes` value)
    // in generating rollup options. But when the command is test, we don't need to get the rollup options.
    // So in test, we assume the mode is 'development'.
    command === 'test' ? getDefaultDefineValues('development') : {},
    stringifyObject(config.define || {}),
  );

  config.sourcemap = config.sourcemap ?? command === 'start';

  if (config.type === 'bundle') {
    const defaultBundleSwcConfig = getDefaultBundleSwcConfig(config, context, taskName);
    config.swcCompileOptions = typeof config.modifySwcCompileOptions === 'function' ?
      config.modifySwcCompileOptions(defaultBundleSwcConfig) :
      deepmerge(
        defaultBundleSwcConfig,
        config.swcCompileOptions || {},
      );
  } else if (config.type === 'transform') {
    config.outputDir = getTransformDefaultOutputDir(rootDir, taskName);
    const mode = command === 'build' ? 'production' : 'development';
    config.modes = [mode];
    const defaultTransformSwcConfig = getDefaultTransformSwcConfig(config, context, taskName, mode);
    config.swcCompileOptions = typeof config.modifySwcCompileOptions === 'function' ?
      config.modifySwcCompileOptions(defaultTransformSwcConfig) :
      deepmerge(
        defaultTransformSwcConfig,
        config.swcCompileOptions || {},
      );
  } else {
    throw new Error('Invalid task type.');
  }

  return buildTask;
}
