import deepmerge from 'deepmerge';
import { formatEntry, getDefaultEntryDir, getOutputDir } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { normalizeRollupConfig } from './normalizeRollupConfig.js';
import { stringifyObject } from '../utils.js';

import type { PkgContext, PkgTaskConfig, TaskLoaderConfig } from '../types.js';

export const mergeConfigOptions = (
  taskConfig: PkgTaskConfig,
  ctx: PkgContext,
): TaskLoaderConfig => {
  const { rootDir, command } = ctx;
  const { config, name: taskName } = taskConfig;
  const { rollupOptions, rollupPlugins, ...restConfig } = config;
  const normalizedConfig: TaskLoaderConfig = { ...restConfig, taskName };
  const { entry, outputDir, swcCompileOptions = {}, define } = normalizedConfig;

  if (normalizedConfig.type === 'transform') {
    normalizedConfig.mode = command === 'build' ? 'production' : 'development';
  }

  // Configure task entry
  if (normalizedConfig.type === 'bundle') {
    normalizedConfig.entry = formatEntry(entry);
  } else if (normalizedConfig.type === 'transform') {
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
    normalizedConfig.type === 'bundle'
      ? getDefaultBundleSwcConfig(normalizedConfig, ctx, taskName)
      : getDefaultTransformSwcConfig(normalizedConfig, ctx, taskName),
    swcCompileOptions,
  );

  // Configure rollup plugins & options
  const [resolvedPlugins, resolvedRollupOptions] = normalizeRollupConfig(
    normalizedConfig,
    ctx,
    taskName,
    rollupPlugins,
    rollupOptions,
  );

  normalizedConfig.rollupPlugins = resolvedPlugins;
  normalizedConfig.rollupOptions = resolvedRollupOptions;

  return normalizedConfig;
};
