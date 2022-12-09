import { join, resolve } from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import deepmerge from 'deepmerge';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import alias from '@rollup/plugin-alias';
import autoprefixer from 'autoprefixer';
import json from '@rollup/plugin-json';
import swcPlugin from '../rollupPlugins/swc.js';
import dtsPlugin from '../rollupPlugins/dts.js';
import minifyPlugin from '../rollupPlugins/minify.js';
import babelPlugin from '../rollupPlugins/babel.js';
import aliasPlugin from '../rollupPlugins/transform/alias.js';
import { builtinNodeModules } from './builtinModules.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

import type { Plugin as RollupPlugin, RollupOptions, OutputOptions } from 'rollup';
import { BundleTaskConfig, ReverseMap, TaskName, TaskConfig, PkgContext, NodeEnvMode } from '../types.js';

interface PkgJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: string | Record<string, string>;
}

const getFilenamePrefix = (filename: string, format: string, esVersion: string): string => {
  return `${filename}.${format}.${esVersion}`;
};

type GetRollupOutputs = (options: {
  taskConfig: BundleTaskConfig;
  command: PkgContext['command'];
  globals: Record<string, string>;
  outputDir: string;
  pkg: PkgJson;
  esVersion: string;
  mode: NodeEnvMode; // Any additional mode like profiling.
}) => OutputOptions[];
const getRollupOutputs: GetRollupOutputs = ({
  globals,
  taskConfig,
  command,
  pkg,
  outputDir,
  esVersion,
}) => {
  const outputs: OutputOptions[] = [];

  const outputFormats = (taskConfig.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;
  const minify = taskConfig.minify ?? taskConfig.mode === 'production';
  const name = taskConfig.name ?? pkg.name;

  outputFormats.forEach((format) => {
    const commonOptions: OutputOptions = {
      name,
      format,
      globals,
      sourcemap: taskConfig.sourcemap,
      exports: 'auto',
      assetFileNames: '[name][extname]',
    };

    const output: OutputOptions = {
      ...commonOptions,
      plugins: [
        minify && minifyPlugin({ sourcemap: taskConfig.sourcemap }),
      ].filter(Boolean),
    };

    output.dir = outputDir;
    output.entryFileNames = () => `${getFilenamePrefix('[name]', format, esVersion)}.${taskConfig.mode}.js`;
    output.chunkFileNames = () => `${getFilenamePrefix('[hash]', format, esVersion)}.${taskConfig.mode}.js`;
    outputs.push(output);
  });

  return outputs;
};

function getExternalsAndGlobals(
  taskConfig: BundleTaskConfig,
  pkg: PkgJson,
): [(id?: string) => boolean, Record<string, string>] {
  let externals: string[] = [];
  let globals: Record<string, string> = {};

  const builtinExternals = [
    'react/jsx-runtime',
    'core-js',
    'regenerator-runtime',
  ];

  const externalsConfig = taskConfig.externals ?? false;

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

export const normalizeRollupConfig = (
  taskConfig: TaskConfig,
  ctx: PkgContext,
  taskName: ReverseMap<typeof TaskName>,
): [RollupPlugin[], RollupOptions] => {
  const { swcCompileOptions, type, rollupPlugins, rollupOptions, mode } = taskConfig;
  const { rootDir, userConfig, pkg, commandArgs, command } = ctx;
  const commonPlugins = [
    !!taskConfig.babelPlugins?.length && babelPlugin({ plugins: taskConfig.babelPlugins }),
    swcPlugin({
      type,
      extraSwcOptions: swcCompileOptions,
    }),
  ].filter(Boolean);
  let resolvedPlugins = rollupPlugins ?? [];

  if (type === 'transform') {
    resolvedPlugins = [
      // dts plugin should append ahead for including source code.
      // And dts plugin would never change the contents of file.
      dtsPlugin(taskConfig.entry, userConfig.generateTypesForJs),
      ...resolvedPlugins,
      ...commonPlugins,
      aliasPlugin({
        alias: taskConfig.alias,
        sourcemap: taskConfig.sourcemap,
      }),
    ];

    return [resolvedPlugins, rollupOptions];
  }

  if (type === 'bundle') {
    resolvedPlugins = [
      ...resolvedPlugins,
      replace({
        values: {
          // Insert __DEV__ for users.
          __DEV__: () => JSON.stringify(taskConfig.mode === 'development'),
          'process.env.NODE_ENV': () => JSON.stringify(taskConfig.mode),
          // User define can override above.
          ...taskConfig.define,
        },
        preventAssignment: true,
      }),
      alias({
        entries: Object.entries(taskConfig.alias || {}).map(([key, value]) => ({
          find: key,
          replacement: resolve(rootDir, value),
        })),
      }),
      ...commonPlugins,
      styles((taskConfig.stylesOptions || ((options) => options))({
        plugins: [
          autoprefixer(),
        ],
        mode: 'extract',
        autoModules: true,
        minimize: taskConfig.minify,
        sourceMap: taskConfig.sourcemap,
      })),
      image(),
      json(),
      nodeResolve({ // To locates modules using the node resolution algorithm.
        extensions: [
          '.mjs', '.js', '.json', '.node', // plugin-node-resolve default extensions
          '.ts', '.jsx', '.tsx', '.mts', '.cjs', '.cts', // @ice/pkg default extensions
          ...(taskConfig.extensions || []),
        ],
      }),
      commonjs({ // To convert commonjs to import, make it capabile for rollup to bundle
        extensions: [
          '.js', // plugin-commonjs default extensions
          ...(taskConfig.extensions || []),
        ],
      }),
      commandArgs.analyzer && visualizer({
        title: `Rollup Visualizer(${taskName})`,
        open: true,
        filename: `${taskName}-stats.html`,
      }),
    ].filter(Boolean);

    const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PkgJson);

    const resolvedRollupOptions = deepmerge.all([
      {
        input: taskConfig.entry,
        external,
        output: getRollupOutputs({
          globals,
          command,
          taskConfig,
          pkg: pkg as PkgJson,
          outputDir: taskConfig.outputDir,
          esVersion: taskName === TaskName.BUNDLE_ES2017 ? 'es2017' : 'es5',
          mode,
        }),
      },
      taskConfig.rollupOptions || {},
      {
        plugins: [
          // Custom plugins will add ahead
          ...(taskConfig.rollupOptions?.plugins || []),
          ...resolvedPlugins,
        ],
      },
    ]);

    return [resolvedPlugins, resolvedRollupOptions];
  }
};
