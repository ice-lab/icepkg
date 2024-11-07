import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styler';
import autoprefixer from 'autoprefixer';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import json from '@rollup/plugin-json';
import swcPlugin from '../../rollupPlugins/swc.js';
import minifyPlugin from '../../rollupPlugins/minify.js';
import babelPlugin from '../../rollupPlugins/babel.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import getDefaultDefineValues from '../../helpers/getDefaultDefineValues.js';
import transformAliasPlugin from '../../rollupPlugins/alias.js';
import bundleAliasPlugin from '@rollup/plugin-alias';
import {
  BundleTaskConfig,
  Context,
  NodeEnvMode,
  PackageJson,
  StylesRollupPluginOptions,
  TaskRunnerContext,
} from '../../types.js';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
import path from 'path';
import { BUILTIN_EXTERNAL_MAP } from '../shared/external.js';
import { getFilenameConfig } from '../shared/filename.js';
import { getTaskSwcOptions } from '../../helpers/defaultSwcConfig.js';
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
    rollupOptions.output = getRollupOutputs({
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

interface GetRollupOutputsOptions {
  bundleTaskConfig: BundleTaskConfig;
  globals: Record<string, string>;
  pkg: PackageJson;
  mode: NodeEnvMode;
  command: Context['command'];
}

export function getRollupOutputs({
  globals,
  bundleTaskConfig,
  pkg,
  mode,
  command,
}: GetRollupOutputsOptions): OutputOptions[] {
  const { outputDir, vendorName = 'vendor' } = bundleTaskConfig;

  const outputFormats = bundleTaskConfig.formats ?? [];

  const name = bundleTaskConfig.name ?? pkg.name;
  const minify = bundleTaskConfig.jsMinify!(mode, command);

  return outputFormats.map((format) => {
    const filenameConfig = getFilenameConfig(format, mode);
    return {
      name,
      format: format.module,
      globals,
      sourcemap: bundleTaskConfig.sourcemap,
      exports: 'auto',
      dir: outputDir,
      assetFileNames: filenameConfig.asset,
      entryFileNames: filenameConfig.js,
      chunkFileNames: filenameConfig.js,
      manualChunks:
        format.module !== 'umd' && bundleTaskConfig.codeSplitting !== false
          ? (id, { getModuleInfo }) => {
              if (/node_modules/.test(id)) {
                return vendorName;
              }

              const entryPoints: string[] = [];

              const moduleInfo = getModuleInfo(id);
              if (!moduleInfo) return;
              const idsToHandle = new Set(moduleInfo.importers);

              for (const moduleId of idsToHandle) {
                const info = getModuleInfo(moduleId);
                if (!info) continue;
                const { isEntry, importers } = info;
                if (isEntry) {
                  entryPoints.push(moduleId);
                }

                for (const importerId of importers) {
                  idsToHandle.add(importerId);
                }
              }
              // For multiple entries, we put it into a "shared code" bundle
              if (entryPoints.length > 1) {
                return vendorName;
              }
            }
          : undefined,
      plugins: [
        minify && minifyPlugin(bundleTaskConfig.sourcemap, typeof minify === 'boolean' ? {} : minify.options),
      ].filter(Boolean),
    };
  });
}

export function getExternalsAndGlobals(
  bundleTaskConfig: BundleTaskConfig,
  pkg: PackageJson,
): [(id: string) => boolean, Record<string, string>] {
  // TODO: unique externals after all pushed
  const exactExternals: string[] = [];
  const regexpExternals: RegExp[] = [];
  const globals: Record<string, string> = {};

  const userExternals = bundleTaskConfig.externals ?? false;

  if (userExternals === true) {
    exactExternals.push(
      ...BUILTIN_EXTERNAL_MAP['builtin:normal'],
      ...BUILTIN_EXTERNAL_MAP['builtin:node'],
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    );
  } else if (userExternals === false) {
    // do nothing
  } else if (Array.isArray(userExternals)) {
    for (const item of userExternals) {
      if (typeof item === 'string') {
        if (item in BUILTIN_EXTERNAL_MAP) {
          exactExternals.push(...BUILTIN_EXTERNAL_MAP[item]);
        } else {
          exactExternals.push(item);
        }
      } else if (item instanceof RegExp) {
        regexpExternals.push(item);
      } else if (typeof item === 'object') {
        exactExternals.push(...Object.keys(item));
        Object.assign(globals, item);
      }
    }
  } else if (typeof userExternals === 'object') {
    exactExternals.push(...Object.keys(userExternals));
    Object.assign(globals, userExternals);
  }

  const externalFun =
    !exactExternals.length && !regexpExternals.length
      ? () => false
      : (id: string) => exactExternals.includes(id) || regexpExternals.some((reg) => reg.test(id));

  return [externalFun, globals];
}
