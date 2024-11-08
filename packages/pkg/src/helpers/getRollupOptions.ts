import escapeStringRegexp from 'escape-string-regexp';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styler';
import autoprefixer from 'autoprefixer';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import json from '@rollup/plugin-json';
import swcPlugin from '../rollupPlugins/swc.js';
import dtsPlugin from '../rollupPlugins/dts.js';
import minifyPlugin from '../rollupPlugins/minify.js';
import babelPlugin from '../rollupPlugins/babel.js';
import { builtinNodeModules } from './builtinModules.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import getDefaultDefineValues from './getDefaultDefineValues.js';
import transformAliasPlugin from '../rollupPlugins/alias.js';
import bundleAliasPlugin from '@rollup/plugin-alias';

import {
  Context,
  TaskName,
  NodeEnvMode,
  BundleTaskConfig,
  TaskRunnerContext,
  StylesRollupPluginOptions,
} from '../types.js';
import type {
  RollupOptions,
  OutputOptions,
  Plugin,
} from 'rollup';
import path from 'path';

interface PkgJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: string | Record<string, string>;
}

export function getRollupOptions(
  context: Context,
  taskRunnerContext: TaskRunnerContext,
) {
  const { pkg, commandArgs, command, userConfig, rootDir } = context;
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
    if (userConfig.declaration) {
      plugins.unshift(
        dtsPlugin({
          rootDir,
          entry: taskConfig.entry as Record<string, string>,
          generateTypesForJs: userConfig.generateTypesForJs,
          alias: taskConfig.alias,
          outputDir: taskConfig.outputDir,
        }),
      );
    }
    plugins.push(transformAliasPlugin(rootDir, taskConfig.alias));
  } else if (taskConfig.type === 'bundle') {
    const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PkgJson);
    rollupOptions.input = taskConfig.entry;
    rollupOptions.external = external;
    rollupOptions.output = getRollupOutputs({
      globals,
      bundleTaskConfig: taskConfig,
      pkg: pkg as PkgJson,
      esVersion: taskName === TaskName.BUNDLE_ES2017 ? 'es2017' : 'es5',
      mode: taskRunnerContext.mode,
      command,
    });

    const cssMinify = taskConfig.cssMinify(taskRunnerContext.mode, command);
    const defaultStylesOptions: StylesRollupPluginOptions = {
      plugins: [
        autoprefixer(),
        PostcssPluginRpxToVw,
      ],
      mode: 'extract',
      autoModules: true,
      minimize: typeof cssMinify === 'boolean' ? cssMinify : cssMinify.options,
      sourceMap: taskConfig.sourcemap,
    };
    const alias = {};
    Object.keys(taskConfig.alias).forEach((key) => {
      // Add full path for relative path alias
      alias[key] = taskConfig.alias[key].startsWith('.') ? path.resolve(rootDir, taskConfig.alias[key]) : taskConfig.alias[key];
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
      styles((taskConfig.modifyStylesOptions ?? [((options) => options)]).reduce(
        (prevStylesOptions, modifyStylesOptions) => modifyStylesOptions(prevStylesOptions),
        defaultStylesOptions,
      )),
      image(),
      json(),
      nodeResolve({ // To locates modules using the node resolution algorithm.
        extensions: [
          '.mjs', '.js', '.json', '.node', // plugin-node-resolve default extensions
          '.ts', '.jsx', '.tsx', '.mts', '.cjs', '.cts', // @ice/pkg default extensions
          ...(taskConfig.extensions || []),
        ],
        browser: taskConfig.browser,
      }),
      commonjs({ // To convert commonjs to import, make it compatible with rollup to bundle
        extensions: [
          '.js', // plugin-commonjs default extensions
          '.jsx', '.ts', '.tsx',
          ...(taskConfig.extensions || []),
        ],
        transformMixedEsModules: true,
      }),
      bundleAliasPlugin({
        entries: alias,
      }),
    );
    if (commandArgs.analyzer) {
      plugins.push(visualizer({
        title: `Rollup Visualizer(${taskName})`,
        open: true,
        filename: `${taskName}-stats.html`,
      }));
    }
  }

  rollupOptions.plugins = plugins;

  return (taskConfig.modifyRollupOptions ?? [((options) => options)]).reduce(
    (prevRollupOptions, modifyRollupOptions) => modifyRollupOptions(prevRollupOptions),
    rollupOptions,
  );
}

interface GetRollupOutputsOptions {
  bundleTaskConfig: BundleTaskConfig;
  globals: Record<string, string>;
  pkg: PkgJson;
  esVersion: string;
  mode: NodeEnvMode;
  command: Context['command'];
}
function getRollupOutputs({
  globals,
  bundleTaskConfig,
  pkg,
  mode,
  esVersion,
  command,
}: GetRollupOutputsOptions): OutputOptions[] {
  const { outputDir, vendorName = 'vendor' } = bundleTaskConfig;

  const outputFormats = (bundleTaskConfig.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;

  const name = bundleTaskConfig.name ?? pkg.name;
  const minify = bundleTaskConfig.jsMinify(mode, command);

  return outputFormats.map((format) => ({
    name,
    format,
    globals,
    sourcemap: bundleTaskConfig.sourcemap,
    exports: 'auto',
    dir: outputDir,
    assetFileNames: getFilename('[name]', format, esVersion, mode, '[ext]'),
    entryFileNames: getFilename('[name]', format, esVersion, mode, 'js'),
    chunkFileNames: getFilename('[name]', format, esVersion, mode, 'js'),
    manualChunks: format !== 'umd' ? (id, { getModuleInfo }) => {
      if (/node_modules/.test(id)) {
        return vendorName;
      }

      const entryPoints = [];

      const idsToHandle = new Set(getModuleInfo(id).importers);

      for (const moduleId of idsToHandle) {
        const { isEntry, importers } = getModuleInfo(
          moduleId,
        );
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
    } : undefined,
    plugins: [
      minify && minifyPlugin(bundleTaskConfig.sourcemap, typeof minify === 'boolean' ? {} : minify.options),
    ].filter(Boolean),
  }));
}

function getExternalsAndGlobals(
  bundleTaskConfig: BundleTaskConfig,
  pkg: PkgJson,
): [(id?: string) => boolean, Record<string, string>] {
  let externals: string[] = [];
  let globals: Record<string, string> = {};

  const builtinExternals = [
    'react/jsx-runtime',
    'core-js',
    'regenerator-runtime',
  ];

  const externalsConfig = bundleTaskConfig.externals ?? false;

  switch (externalsConfig) {
    case true:
      externals = [
        ...builtinNodeModules,
        ...builtinExternals,
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ];
      break;
    case false:
      externals = [];
      break;
    default:
      externals = Object.keys(externalsConfig);
      globals = externalsConfig;
      break;
  }

  const externalPredicate = new RegExp(`^(${externals.map(escapeStringRegexp).join('|')})($|/)`);

  const externalFun = externals.length === 0
    ? () => false
    : (id: string) => externalPredicate.test(id);

  return [externalFun, globals];
}

function getFilename(...args: string[]): string {
  return args.join('.');
}
