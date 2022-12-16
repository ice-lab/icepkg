import deepmerge from 'deepmerge';
import { formatEntry, getDefaultEntryDir, getOutputDir } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { normalizeRollupConfig } from './normalizeRollupConfig.js';
import { stringifyObject } from '../utils.js';

import type { PkgContext, PkgTaskConfig, TaskLoaderConfig } from '../types.js';

export const mergeConfigOptions = (
  cfg: PkgTaskConfig,
  ctx: PkgContext,
): TaskLoaderConfig => {
  const { rootDir, command } = ctx;
  const { config: taskConfig, name: taskName } = cfg;
  const normalizedConfig = { ...taskConfig, name: taskName };
  const { type, entry, outputDir, swcCompileOptions = {}, define } = normalizedConfig;
  const isBundleTask = type === 'bundle';
  const isTransformTask = type === 'transform';

  if (isBundleTask) {
    normalizedConfig.mode = taskConfig.mode;
  } else if (isTransformTask) {
    normalizedConfig.mode = command === 'build' ? 'production' : 'development';
  }

  // Configure task entry
  if (isBundleTask) {
    normalizedConfig.entry = formatEntry(entry);
  } else if (isTransformTask) {
    normalizedConfig.entry = getDefaultEntryDir(rootDir);
  } else {
    throw new Error('Invalid task type.');
  }

  // Configure task outputDir
  normalizedConfig.outputDir = outputDir || getOutputDir(rootDir, taskName);

  // Configure define
  normalizedConfig.define = stringifyObject(define || {});

  normalizedConfig.sourcemap = normalizedConfig.sourcemap ?? command === 'start';

  // Configure swcOptions
  normalizedConfig.swcCompileOptions = deepmerge(
    isBundleTask
      ? getDefaultBundleSwcConfig(normalizedConfig, ctx, taskName)
      : getDefaultTransformSwcConfig(normalizedConfig, ctx, taskName),
    swcCompileOptions,
  );

  // Configure rollup plugins & options
  const [resolvedPlugins, resolvedRollupOptions] = normalizeRollupConfig(
    normalizedConfig,
    ctx,
    taskName,
  );

  normalizedConfig.rollupPlugins = resolvedPlugins;
  normalizedConfig.rollupOptions = resolvedRollupOptions;

  return normalizedConfig;
};
