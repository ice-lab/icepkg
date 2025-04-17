import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styler';
import autoprefixer from 'autoprefixer';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import json from '@rollup/plugin-json';
import swcPlugin from '../rollupPlugins/swc.js';
import minifyPlugin from '../rollupPlugins/minify.js';
import babelPlugin from '../rollupPlugins/babel.js';
import { builtinNodeModules } from './builtinModules.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import getDefaultDefineValues from './getDefaultDefineValues.js';
import transformAliasPlugin from '../rollupPlugins/alias.js';
import bundleAliasPlugin from '@rollup/plugin-alias';

import { Context, NodeEnvMode, BundleTaskConfig, TaskRunnerContext, StylesRollupPluginOptions } from '../types.js';
import type { RollupOptions, OutputOptions, Plugin } from 'rollup';
import path from 'path';

interface PkgJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: string | Record<string, string>;
}

export function getRollupOptions(context: Context, taskRunnerContext: TaskRunnerContext) {
  const { pkg, commandArgs, command, rootDir } = context;
  const { name: taskName, config: taskConfig } = taskRunnerContext.buildTask;
  const rollupOptions: RollupOptions = {};
  const plugins: Plugin[] = [];

  if (taskConfig.babelPlugins?.length) {
    plugins.push(
      babelPlugin(
        taskConfig.babelPlugins,
        {
          jsxRuntime: taskConfig.jsxRuntime,
          pragma: taskConfig?.swcCompileOptions?.jsc?.transform?.react?.pragma,
          pragmaFrag: taskConfig?.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
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
      taskConfig.swcCompileOptions,
      taskConfig.type === 'bundle' && taskConfig.compileDependencies,
    ),
  );

  if (taskConfig.type === 'transform') {
    plugins.push(transformAliasPlugin(rootDir, taskConfig.alias));
  } else if (taskConfig.type === 'bundle') {
    const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PkgJson);
    rollupOptions.input = taskConfig.entry;
    rollupOptions.external = external;
    rollupOptions.output = getRollupOutputs({
      globals,
      bundleTaskConfig: taskConfig,
      pkg: pkg as PkgJson,
      mode: taskRunnerContext.mode,
      command,
    });

    const cssMinify = taskConfig.cssMinify(taskRunnerContext.mode, command);
    const defaultStylesOptions: StylesRollupPluginOptions = {
      plugins: [autoprefixer(), PostcssPluginRpxToVw],
      mode: 'extract',
      autoModules: true,
      minimize: typeof cssMinify === 'boolean' ? cssMinify : cssMinify.options,
      sourceMap: taskConfig.sourcemap,
    };
    const alias = {};
    Object.keys(taskConfig.alias).forEach((key) => {
      // Add full path for relative path alias
      alias[key] = taskConfig.alias[key].startsWith('.')
        ? path.resolve(rootDir, taskConfig.alias[key])
        : taskConfig.alias[key];
    });
    plugins.push(
      replace({
        values: {
          ...getDefaultDefineValues(taskRunnerContext.mode),
          // User define can override above.
          ...taskConfig.define,
        },
        preventAssignment: true,
      }),
      styles(
        (taskConfig.modifyStylesOptions ?? [(options) => options]).reduce(
          (prevStylesOptions, modifyStylesOptions) => modifyStylesOptions(prevStylesOptions),
          defaultStylesOptions,
        ),
      ),
      image(),
      json(),
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
  pkg: PkgJson;
  mode: NodeEnvMode;
  command: Context['command'];
}
function getRollupOutputs({ globals, bundleTaskConfig, pkg, mode, command }: GetRollupOutputsOptions): OutputOptions[] {
  const { outputDir, vendorName = 'vendor' } = bundleTaskConfig;

  const outputFormats = bundleTaskConfig.formats ?? [];

  const name = bundleTaskConfig.name ?? pkg.name;
  const minify = bundleTaskConfig.jsMinify(mode, command);

  return outputFormats.map((format) => ({
    name,
    format: format.module,
    globals,
    sourcemap: bundleTaskConfig.sourcemap,
    exports: 'auto',
    dir: outputDir,
    assetFileNames: getFilename('[name]', format.module, format.target, mode, '[ext]'),
    entryFileNames: getFilename('[name]', format.module, format.target, mode, 'js'),
    chunkFileNames: getFilename('[name]', format.module, format.target, mode, 'js'),
    manualChunks:
      format.module !== 'umd'
        ? (id, { getModuleInfo }) => {
            if (/node_modules/.test(id)) {
              return vendorName;
            }

            const entryPoints = [];

            const idsToHandle = new Set(getModuleInfo(id).importers);

            for (const moduleId of idsToHandle) {
              const { isEntry, importers } = getModuleInfo(moduleId);
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
  }));
}

const BUILTIN_EXTERNAL_MAP: Record<string, string[]> = {
  'builtin:normal': ['core-js', 'regenerator-runtime'],
  'builtin:node': builtinNodeModules,
};

function getExternalsAndGlobals(
  bundleTaskConfig: BundleTaskConfig,
  pkg: PkgJson,
): [(id?: string) => boolean, Record<string, string>] {
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

function getFilename(...args: string[]): string {
  return args.join('.');
}
