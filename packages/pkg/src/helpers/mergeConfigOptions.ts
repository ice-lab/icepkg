import deepmerge from 'deepmerge';
import { getEntryDir, getEntryFile, getOutputDir } from './getTaskIO.js';
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from './defaultSwcConfig.js';
import { normalizeRollupConfig } from './normalizeRollupConfig.js';

import type { PkgContext, TaskLoaderConfig, PkgTaskConfig } from '../types.js';

export const mergeConfigOptions = (
  cfg: PkgTaskConfig,
  ctx: PkgContext,
): TaskLoaderConfig => {
  const { rootDir, userConfig } = ctx;
  const { config: taskConfig, name: taskName } = cfg;
  const normalizedConfig = { ...taskConfig };
  const { type, entry, outputDir, swcCompileOptions = {} } = normalizedConfig;
  const isBundleTask = type === 'bundle';

  // Configure task entry
  normalizedConfig.entry = entry || (
    isBundleTask ? getEntryFile(rootDir) : getEntryDir(rootDir)
  );

  // Configure task outputDir
  normalizedConfig.outputDir = outputDir || getOutputDir(rootDir, taskName);

  // Configure swcOptions
  const swcOptionOverride = deepmerge(
    isBundleTask
      ? getDefaultBundleSwcConfig(userConfig, taskName)
      : getDefaultTransformSwcConfig(userConfig, taskName),
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
