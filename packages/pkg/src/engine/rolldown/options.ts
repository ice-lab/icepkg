import { RolldownOptions, Plugin, OutputOptions } from 'rolldown';
import { Context, StylesRollupPluginOptions, TaskRunnerContext, PackageJson } from '../../types.js';
import { getExternalsAndGlobals, getRollupOutputs } from '../rollup/options.js';
import { assertTaskBundleConfig } from '../../helpers/taskConfig.js';
import path from 'node:path';
import getDefaultDefineValues from '../../helpers/getDefaultDefineValues.js';
import styles from 'rollup-plugin-styler';
import image from '@rollup/plugin-image';
import autoprefixer from 'autoprefixer';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import { visualizer } from 'rollup-plugin-visualizer';
import { JSX_RUNTIME_SOURCE } from '../../constants.js';
import { RollupOptions } from 'rollup';

export function getRolldownOptions(context: Context, taskRunnerContext: TaskRunnerContext): RolldownOptions {
  const { pkg, commandArgs, command, rootDir } = context;
  const { buildTask } = taskRunnerContext;
  const { name: taskName, config: taskConfig } = buildTask;

  assertTaskBundleConfig(taskConfig);

  const options: RolldownOptions = {};

  const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PackageJson);

  options.input = taskConfig.entry;
  options.external = external;
  // TODO: should warning if output is multiple
  options.output = getRollupOutputs({
    globals,
    bundleTaskConfig: taskConfig,
    pkg: pkg as PackageJson,
    mode: taskRunnerContext.mode,
    command,
  })[0] as OutputOptions;

  const alias: Record<string, string> = {};
  if (taskConfig.alias) {
    for (const key of Object.keys(taskConfig.alias)) {
      // Add full path for relative path alias
      alias[key] = taskConfig.alias[key].startsWith('.')
        ? path.resolve(rootDir, taskConfig.alias[key])
        : taskConfig.alias[key];
    }
  }

  const plugins: Plugin[] = [];

  options.resolve = {
    alias,
  };
  options.define = {
    ...getDefaultDefineValues(taskRunnerContext.mode),
    // User define can override above.
    ...taskConfig.define,
  };

  options.jsx = {
    mode: taskConfig.jsxRuntime ?? 'automatic',
    jsxImportSource: JSX_RUNTIME_SOURCE,
  };

  const cssMinify = taskConfig.cssMinify!(taskRunnerContext.mode, command);
  const defaultStylesOptions: StylesRollupPluginOptions = {
    plugins: [autoprefixer(), PostcssPluginRpxToVw],
    mode: 'extract',
    autoModules: true,
    minimize: typeof cssMinify === 'boolean' ? cssMinify : cssMinify.options,
    sourceMap: taskConfig.sourcemap,
  };

  plugins.push(
    styles(
      (taskConfig.modifyStylesOptions ?? [(options) => options]).reduce<StylesRollupPluginOptions>(
        (prevStylesOptions, modifyStylesOptions) => modifyStylesOptions(prevStylesOptions),
        defaultStylesOptions,
      ),
    ) as unknown as Plugin<any>,
    image() as unknown as Plugin<any>,
  );

  if (commandArgs.analyzer) {
    plugins.push(
      visualizer({
        title: `Rollup Visualizer(${taskName})`,
        open: true,
        filename: `${taskName}-stats.html`,
      }) as unknown as Plugin,
    );
  }

  options.plugins = plugins;

  return (taskConfig.modifyRollupOptions ?? [(options) => options]).reduce(
    (prevOptions, modifyRollupOptions) =>
      modifyRollupOptions(prevOptions as unknown as RollupOptions) as RolldownOptions,
    options,
  );
}
