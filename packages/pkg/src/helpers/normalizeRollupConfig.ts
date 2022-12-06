import { join, resolve } from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import deepmerge from 'deepmerge';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
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

import type { Plugin as RollupPlugin, RollupOptions, OutputOptions } from 'rollup';
import { BundleTaskConfig, ReverseMap, TaskName, TaskConfig, PkgContext } from '../types.js';

interface PkgJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: string | Record<string, string>;
}

const getFilenamePrefix = (filename: string, format: string, isES2017: boolean): string => {
  const formatPrefix = (format === 'umd' || format === 'cjs') ? `.${format}` : '';
  return `${filename}${formatPrefix}${isES2017 ? '.es2017' : ''}`;
};

type GetRollupOutputs = (options: {
  taskConfig: BundleTaskConfig;
  command: PkgContext['command'];
  globals: Record<string, string>;
  outputDir: string;
  pkg: PkgJson;
  isES2017: boolean;
}) => OutputOptions[];
const getRollupOutputs: GetRollupOutputs = ({
  globals,
  taskConfig,
  command,
  pkg,
  outputDir,
  isES2017,
}) => {
  const outputs: OutputOptions[] = [];

  const uncompressedDevelopment = taskConfig.development;
  const outputFormats = (taskConfig.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;
  const minify = taskConfig.minify ?? command === 'build';
  const name = taskConfig.name ?? pkg.name;

  outputFormats.forEach((format) => {
    const commonOptions: OutputOptions = {
      name,
      format,
      globals,
      sourcemap: taskConfig.sourcemap,
      exports: 'auto',
    };

    const output: OutputOptions = {
      ...commonOptions,
      plugins: [
        minify && minifyPlugin({ sourcemap: taskConfig.sourcemap }),
      ].filter(Boolean),
    };

    if (typeof taskConfig.entry === 'string') {
      output.file = join(outputDir, `${getFilenamePrefix(taskConfig.filename || 'index', format, isES2017)}.production.js`);
    } else {
      // If entry is an array or and object, don't set output.file.
      output.dir = outputDir;
      output.entryFileNames = `${getFilenamePrefix('[name]', format, isES2017)}.production.js`;
    }
    outputs.push(output);

    if (uncompressedDevelopment) {
      const developmentOutput: OutputOptions = {
        ...commonOptions,
      };
      // If `entry` is an array or and object, don't set `output.file`.
      if (typeof taskConfig.entry === 'string') {
        developmentOutput.file = join(outputDir, `${getFilenamePrefix(taskConfig.filename || 'index', format, isES2017)}.development.js`);
      } else {
        developmentOutput.dir = outputDir;
        developmentOutput.entryFileNames = `${getFilenamePrefix('[name]', format, isES2017)}.development.js`;
      }
      outputs.push(developmentOutput);
    }
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
  const { swcCompileOptions, type, outputDir, rollupPlugins, rollupOptions } = taskConfig;
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
      alias({
        entries: Object.entries(taskConfig.alias || {}).map(([key, value]) => ({
          find: key,
          replacement: resolve(rootDir, value),
        })),
      }),
      ...commonPlugins,
      postcss((taskConfig.postcssOptions || ((options) => options))({
        plugins: [autoprefixer()],
        extract: resolve(rootDir, outputDir, 'index.css'),
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
          isES2017: taskName === TaskName.BUNDLE_ES2017,
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
