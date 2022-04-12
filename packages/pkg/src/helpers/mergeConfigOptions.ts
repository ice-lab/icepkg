import { join } from 'path';
import deepmerge from 'deepmerge';
import { getEntryDir, getEntryFile } from './getTaskEntry.js';
import { getBundleSwcConfig, getTransformSwcConfig } from './getSwcConfig.js';
import { normalizeRollupConfig } from './normalizeRollupConfig.js';

import type { ComponentContext, ComponentConfig, ComponentTaskConfig, TaskName } from '../types.js';

export const mergeConfigOptions = (
  cfg: ComponentTaskConfig,
  ctx: ComponentContext,
): ComponentConfig => {
  const { rootDir, userConfig } = ctx;
  const { config: taskConfig, name: taskName } = cfg;
  const normalizedConfig = { ...taskConfig };
  const { type, entry, outputDir, swcCompileOptions = {} } = normalizedConfig;
  const isBundleTask = type === 'bundle';

  // Configure task entry
  normalizedConfig.entry = entry || (
    isBundleTask ? getEntryFile(rootDir) : getEntryDir(rootDir)
  );

  // Configure task outputDir（Taskname 以 pkg-[cjs|esm|es2017 命名]）
  normalizedConfig.outputDir = outputDir || join(rootDir, taskName.split('-')[1]);

  // Configure swcOptions
  const swcOptionOverride = deepmerge(
    isBundleTask
      ? getBundleSwcConfig(userConfig as any)
      : getTransformSwcConfig(userConfig as any, taskName as TaskName),
    swcCompileOptions,
  );

  normalizedConfig.swcCompileOptions = swcOptionOverride;

  // Configure rollup plugins & options
  const [resolvedPlugins, resolvedRollupOption] = normalizeRollupConfig(normalizedConfig, ctx);

  normalizedConfig.rollupPlugins = resolvedPlugins;
  normalizedConfig.rollupOptions = resolvedRollupOption;

  return normalizedConfig;
};
