import deepmerge from 'deepmerge';
import { getDefaultEntryDir, getDefaultEntryFile, getOutputDir } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { normalizeRollupConfig } from './normalizeRollupConfig.js';
import { stringifyObject } from '../utils.js';

import type { PkgContext, TaskLoaderConfig, PkgTaskConfig } from '../types.js';

export const mergeConfigOptions = (
  cfg: PkgTaskConfig,
  ctx: PkgContext,
): TaskLoaderConfig => {
  const { rootDir, command } = ctx;
  const { config: taskConfig, name: taskName } = cfg;
  const normalizedConfig = { ...taskConfig };
  const { type, entry, outputDir, swcCompileOptions = {}, define } = normalizedConfig;
  const isBundleTask = type === 'bundle';

  // Configure task entry
  normalizedConfig.entry = entry || (
    // default entry
    isBundleTask ? getDefaultEntryFile(rootDir) : getDefaultEntryDir(rootDir)
  );

  // Configure task outputDir
  normalizedConfig.outputDir = outputDir || getOutputDir(rootDir, taskName);

  // Configure define
  normalizedConfig.define = stringifyObject(deepmerge(
    {
      // Insert __DEV__ for users, can be overridden too.
      __DEV__: "process.env.NODE_ENV === 'development'",
      'process.env.NODE_ENV': process.env.NODE_ENV,
    },
    define ?? {},
  ));

  normalizedConfig.sourcemap = normalizedConfig.sourcemap ?? command === 'start';

  // Configure swcOptions
  const swcOptionOverride = deepmerge(
    isBundleTask
      ? getDefaultBundleSwcConfig(taskName)
      : getDefaultTransformSwcConfig(normalizedConfig, taskName),
    swcCompileOptions,
  );

  normalizedConfig.swcCompileOptions = swcOptionOverride;

  // Configure rollup plugins & options
  const [resolvedPlugins, resolvedRollupOptions] = normalizeRollupConfig(
    normalizedConfig,
    ctx,
    taskName,
  );

  normalizedConfig.rollupPlugins = resolvedPlugins;
  normalizedConfig.rollupOptions = resolvedRollupOptions;

  return {
    ...normalizedConfig,
    name: taskName,
  };
};
