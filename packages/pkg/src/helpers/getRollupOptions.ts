import escapeStringRegexp from 'escape-string-regexp';
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

import {
  Context,
  TaskName,
  NodeEnvMode,
  BundleTaskConfig,
  TaskRunnerContext,
} from '../types.js';
import type {
  RollupOptions,
  OutputOptions,
} from 'rollup';

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
  const { pkg, commandArgs, command, userConfig } = context;
  const { name: taskName, config } = taskRunnerContext.buildTask;
  const rollupOptions: RollupOptions = {};
  rollupOptions.plugins ??= [];

  if (config.babelPlugins?.length) {
    rollupOptions.plugins.push(babelPlugin(config.babelPlugins));
  }
  rollupOptions.plugins.push(swcPlugin(config.type, config.swcCompileOptions));

  if (config.type === 'transform') {
    rollupOptions.plugins.push(
      dtsPlugin(config.entry, userConfig.generateTypesForJs),
    );
  } else if (config.type === 'bundle') {
    const [external, globals] = getExternalsAndGlobals(config, pkg as PkgJson);

    rollupOptions.input = config.entry;
    rollupOptions.external = external;
    rollupOptions.output = getRollupOutputs({
      globals,
      bundleTaskConfig: config,
      pkg: pkg as PkgJson,
      esVersion: taskName === TaskName.BUNDLE_ES2017 ? 'es2017' : 'es5',
      mode: taskRunnerContext.mode,
      command,
    });

    rollupOptions.plugins.push(
      replace({
        values: {
          // Insert __DEV__ for users.
          __DEV__: () => JSON.stringify(taskRunnerContext.mode === 'development'),
          'process.env.NODE_ENV': () => JSON.stringify(taskRunnerContext.mode),
          // User define can override above.
          ...config.define,
        },
        preventAssignment: true,
      }),
      styles((config.stylesOptions || ((options) => options))({
        plugins: [
          autoprefixer(),
        ],
        mode: 'extract',
        autoModules: true,
        minimize: config.minify,
        sourceMap: config.sourcemap,
      })),
      image(),
      json(),
      nodeResolve({ // To locates modules using the node resolution algorithm.
        extensions: [
          '.mjs', '.js', '.json', '.node', // plugin-node-resolve default extensions
          '.ts', '.jsx', '.tsx', '.mts', '.cjs', '.cts', // @ice/pkg default extensions
          ...(config.extensions || []),
        ],
      }),
      commonjs({ // To convert commonjs to import, make it compatible with rollup to bundle
        extensions: [
          '.js', // plugin-commonjs default extensions
          ...(config.extensions || []),
        ],
      }),
    );
    if (commandArgs.analyzer) {
      rollupOptions.plugins.push(visualizer({
        title: `Rollup Visualizer(${taskName})`,
        open: true,
        filename: `${taskName}-stats.html`,
      }));
    }
  }

  return (config.modifyRollupOptions ?? [((options) => options)]).reduce(
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
  const { outputDir } = bundleTaskConfig;

  const outputFormats = (bundleTaskConfig.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;
  const minify = bundleTaskConfig.minify ?? (command === 'build' && mode === 'production');
  const name = bundleTaskConfig.name ?? pkg.name;

  return outputFormats.map((format) => ({
    name,
    format,
    globals,
    sourcemap: bundleTaskConfig.sourcemap,
    exports: 'auto',
    dir: outputDir,
    assetFileNames: getFilename('[name]', format, esVersion, mode, '[ext]'),
    entryFileNames: getFilename('[name]', format, esVersion, mode, 'js'),
    chunkFileNames: getFilename('[hash]', format, esVersion, mode, 'js'),
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return getFilename('vendor', format, esVersion, mode);
      }
    },
    plugins: [
      minify && minifyPlugin(bundleTaskConfig.sourcemap),
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
