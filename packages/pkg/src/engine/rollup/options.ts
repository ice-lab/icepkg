import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styler';
import autoprefixer from 'autoprefixer';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import json from '@rollup/plugin-json';
import swcPlugin from '../../rollupPlugins/swc.js';
import babelPlugin from '../../rollupPlugins/babel.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import getDefaultDefineValues from '../shared/define.js';
import transformAliasPlugin from '../../rollupPlugins/alias.js';
import bundleAliasPlugin from '@rollup/plugin-alias';
import { Context, PackageJson, StylesRollupPluginOptions, TaskRunnerContext } from '../../types.js';
import type { Plugin, RollupOptions } from 'rollup';
import path from 'path';
import { getExternalsAndGlobals } from '../shared/external.js';
import { getOutputs } from '../shared/outputs.js';
import { getTaskSwcOptions } from '../shared/swcConfig.js';
import { assertTaskBuildableConfig } from '../../helpers/taskConfig.js';

export function getRollupOptions(context: Context, taskRunnerContext: TaskRunnerContext) {
  const { pkg, commandArgs, command, rootDir } = context;
  const { name: taskName, config: taskConfig } = taskRunnerContext.buildTask;
  const rollupOptions: RollupOptions = {};
  const plugins: Plugin[] = [];

  assertTaskBuildableConfig(taskConfig);

  const swcCompileOptions = getTaskSwcOptions(taskConfig);

  if (taskConfig.babelPlugins?.length) {
    plugins.push(
      babelPlugin(
        taskConfig.babelPlugins,
        {
          jsxRuntime: taskConfig.jsxRuntime,
          pragma: swcCompileOptions?.jsc?.transform?.react?.pragma,
          pragmaFrag: swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
        },
        taskConfig.type === 'bundle' && taskConfig.compileDependencies,
        taskConfig.modifyBabelOptions,
      ),
    );
  }

  plugins.push(
    swcPlugin(
      taskConfig.jsxRuntime,
      rootDir,
      swcCompileOptions,
      taskConfig.type === 'bundle' && taskConfig.compileDependencies,
    ),
  );

  if (taskConfig.type === 'transform') {
    plugins.push(transformAliasPlugin(rootDir, (taskConfig.alias as Record<string, string>) ?? {}));
  } else if (taskConfig.type === 'bundle') {
    const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PackageJson);
    rollupOptions.input = taskConfig.entry ?? '';
    rollupOptions.external = external;
    rollupOptions.output = getOutputs({
      engine: 'rollup',
      globals: globals ?? {},
      bundleTaskConfig: taskConfig,
      pkg: pkg as PackageJson,
      mode: taskRunnerContext.mode,
      command,
    });

    const cssMinify = taskConfig.cssMinify!(taskRunnerContext.mode, command);
    const defaultStylesOptions: StylesRollupPluginOptions = {
      plugins: [autoprefixer(), PostcssPluginRpxToVw],
      mode: 'extract',
      autoModules: true,
      minimize: typeof cssMinify === 'boolean' ? cssMinify : cssMinify.options,
      sourceMap: taskConfig.sourcemap,
    };
    const alias: Record<string, string> = {};
    if (taskConfig.alias) {
      for (const key of Object.keys(taskConfig.alias)) {
        // Add full path for relative path alias
        alias[key] = taskConfig.alias[key].startsWith('.')
          ? path.resolve(rootDir, taskConfig.alias[key])
          : taskConfig.alias[key];
      }
    }
    plugins.push(
      commonjs({
        // To convert commonjs to import, make it compatible with rollup to bundle
        extensions: [
          '.js', // plugin-commonjs default extensions
          '.jsx',
          '.ts',
          '.tsx',
          ...(taskConfig.extensions || []),
        ],
        transformMixedEsModules: true,
      }),
      nodeResolve({
        // To locates modules using the node resolution algorithm.
        extensions: [
          '.mjs',
          '.js',
          '.json',
          '.node', // plugin-node-resolve default extensions
          '.ts',
          '.jsx',
          '.tsx',
          '.mts',
          '.cjs',
          '.cts', // @ice/pkg default extensions
          ...(taskConfig.extensions || []),
        ],
        browser: taskConfig.browser,
      }),
      replace({
        values: {
          ...getDefaultDefineValues(taskRunnerContext.mode),
          // User define can override above.
          ...taskConfig.define,
        },
        preventAssignment: true,
      }),
      styles(
        (taskConfig.modifyStylesOptions ?? [(options) => options]).reduce<StylesRollupPluginOptions>(
          (prevStylesOptions, modifyStylesOptions) => modifyStylesOptions(prevStylesOptions),
          defaultStylesOptions,
        ),
      ),
      image(),
      json(),
      bundleAliasPlugin({
        entries: alias,
      }),
    );
    if (commandArgs.analyzer) {
      plugins.push(
        visualizer({
          title: `Rollup Visualizer(${taskName})`,
          open: true,
          filename: `${taskName}-stats.html`,
        }),
      );
    }
  }

  rollupOptions.plugins = plugins;

  return (taskConfig.modifyRollupOptions ?? [(options) => options]).reduce(
    (prevRollupOptions, modifyRollupOptions) => modifyRollupOptions(prevRollupOptions),
    rollupOptions,
  );
}
