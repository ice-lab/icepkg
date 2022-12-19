import escapeStringRegexp from 'escape-string-regexp';
import deepmerge from 'deepmerge';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import autoprefixer from 'autoprefixer';
import json from '@rollup/plugin-json';
import swcPlugin from '../rollupPlugins/swc.js';
import dtsPlugin from '../rollupPlugins/dts.js';
import minifyPlugin from '../rollupPlugins/minify.js';
import babelPlugin from '../rollupPlugins/babel.js';
import { builtinNodeModules } from './builtinModules.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

import type {
  Plugin as RollupPlugin,
  RollupOptions,
  OutputOptions,
} from 'rollup';
import {
  ReverseMap,
  TaskName,
  PkgContext,
  NodeEnvMode,
  TaskLoaderConfig,
  BundleTaskLoaderConfig,
} from '../types.js';

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
  taskLoaderConfig: BundleTaskLoaderConfig;
  globals: Record<string, string>;
  pkg: PkgJson;
  esVersion: string;
  mode: NodeEnvMode; // Any additional mode like profiling.
}) => OutputOptions[];
const getRollupOutputs: GetRollupOutputs = ({
  globals,
  taskLoaderConfig,
  pkg,
  mode,
  esVersion,
}) => {
  const { outputDir } = taskLoaderConfig;
  const outputs: OutputOptions[] = [];

  const outputFormats = (taskLoaderConfig.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;
  const minify = taskLoaderConfig.minify ?? mode === 'production';
  const name = taskLoaderConfig.name ?? pkg.name;

  outputFormats.forEach((format) => {
    const commonOptions: OutputOptions = {
      name,
      format,
      globals,
      sourcemap: taskLoaderConfig.sourcemap,
      exports: 'auto',
      assetFileNames: '[name][extname]',
    };

    const output: OutputOptions = {
      ...commonOptions,
      plugins: [
        minify && minifyPlugin({ sourcemap: taskLoaderConfig.sourcemap }),
      ].filter(Boolean),
    };

    output.dir = outputDir;
    output.entryFileNames = () => `${getFilenamePrefix('[name]', format, esVersion)}.${mode}.js`;
    output.chunkFileNames = () => `${getFilenamePrefix('[hash]', format, esVersion)}.${mode}.js`;
    outputs.push(output);
  });

  return outputs;
};

function getExternalsAndGlobals(
  taskConfig: BundleTaskLoaderConfig,
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
  taskLoaderConfig: TaskLoaderConfig,
  ctx: PkgContext,
  taskName: ReverseMap<typeof TaskName>,
  rollupPlugins: RollupPlugin[],
  rollupOptions: RollupOptions,
): [RollupPlugin[], RollupOptions] | [RollupPlugin[][], RollupOptions[]] => {
  const { swcCompileOptions } = taskLoaderConfig;
  const { userConfig, pkg, commandArgs } = ctx;

  const compilerPlugins = [
    !!taskLoaderConfig.babelPlugins?.length && babelPlugin({ plugins: taskLoaderConfig.babelPlugins }),
    swcPlugin({
      type: taskLoaderConfig.type,
      extraSwcOptions: swcCompileOptions,
    }),
  ].filter(Boolean);

  if (taskLoaderConfig.type === 'transform') {
    const resolvedPlugins = [
      ...(rollupPlugins || []),
      ...compilerPlugins,
      dtsPlugin(taskLoaderConfig.entry, userConfig.generateTypesForJs),
    ];

    return [resolvedPlugins, rollupOptions];
  }

  if (taskLoaderConfig.type === 'bundle') {
    const [external, globals] = getExternalsAndGlobals(taskLoaderConfig, pkg as PkgJson);

    const rollupPluginsResult: RollupPlugin[][] = [];
    const rollupOptionsResult: RollupOptions[] = [];

    taskLoaderConfig.modes.forEach((mode) => {
      const resolvedPlugins: RollupPlugin[] = [
        ...(rollupPlugins ?? []),
        ...compilerPlugins,
        replace({
          values: {
            // Insert __DEV__ for users.
            __DEV__: () => JSON.stringify(mode),
            'process.env.NODE_ENV': () => JSON.stringify(mode),
            // User define can override above.
            ...taskLoaderConfig.define,
          },
          preventAssignment: true,
        }),
        styles((taskLoaderConfig.stylesOptions || ((options) => options))({
          plugins: [
            autoprefixer(),
          ],
          mode: 'extract',
          autoModules: true,
          minimize: taskLoaderConfig.minify,
          sourceMap: taskLoaderConfig.sourcemap,
        })),
        image(),
        json(),
        nodeResolve({ // To locates modules using the node resolution algorithm.
          extensions: [
            '.mjs', '.js', '.json', '.node', // plugin-node-resolve default extensions
            '.ts', '.jsx', '.tsx', '.mts', '.cjs', '.cts', // @ice/pkg default extensions
            ...(taskLoaderConfig.extensions || []),
          ],
        }),
        commonjs({ // To convert commonjs to import, make it compatible with rollup to bundle
          extensions: [
            '.js', // plugin-commonjs default extensions
            ...(taskLoaderConfig.extensions || []),
          ],
        }),
        commandArgs.analyzer && visualizer({
          title: `Rollup Visualizer(${taskName})`,
          open: true,
          filename: `${taskName}-stats.html`,
        }),
      ].filter(Boolean);

      const resolvedRollupOptions: RollupOptions = deepmerge.all([
        {
          input: taskLoaderConfig.entry,
          external,
          output: getRollupOutputs({
            globals,
            taskLoaderConfig,
            pkg: pkg as PkgJson,
            esVersion: taskName === TaskName.BUNDLE_ES2017 ? 'es2017' : 'es5',
            mode,
          }),
        },
        rollupOptions || {},
        {
          plugins: [
            // Custom plugins will add ahead
            ...(rollupOptions?.plugins || []),
            ...resolvedPlugins,
          ],
        },
      ]);

      rollupPluginsResult.push(resolvedPlugins);
      rollupOptionsResult.push(resolvedRollupOptions);
    });

    return [rollupPluginsResult, rollupOptionsResult];
  }
};
