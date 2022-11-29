import { join, resolve } from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import deepmerge from 'deepmerge';
import { isFile, findDefaultEntryFile } from '../utils.js';
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
import { TaskName } from '../types.js';
import image from '@rollup/plugin-image';
import { visualizer } from 'rollup-plugin-visualizer';

import type { Plugin as RollupPlugin, RollupOptions, OutputOptions } from 'rollup';
import type { TaskConfig, PkgContext, UserConfig } from '../types.js';

type ReverseMap<T> = T[keyof T];

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
  taskConfig: TaskConfig;
  globals: Record<string, string>;
  userConfig: UserConfig;
  outputDir: string;
  pkg: PkgJson;
  isES2017: boolean;
}) => OutputOptions[];
const getRollupOutputs: GetRollupOutputs = ({
  globals,
  taskConfig,
  userConfig,
  pkg,
  outputDir,
  isES2017,
}) => {
  const outputs: OutputOptions[] = [];

  const uncompressedDevelopment = taskConfig?.bundle?.development;
  const outputFormats = (taskConfig?.bundle?.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm' | 'cjs'>;
  const minify = taskConfig?.bundle?.minify;

  const name = taskConfig?.bundle?.name ?? pkg.name;

  const sourceMaps = userConfig?.sourceMaps ?? false;

  outputFormats.forEach((format) => {
    const commonOption = {
      name,
      format,
      globals,
      sourcemap: sourceMaps,
    };
    const defaultFilenamePrefix = getFilenamePrefix('index', format, isES2017);
    outputs.push({
      ...commonOption,
      file: join(
        outputDir,
        taskConfig?.bundle?.filename ?
          (typeof taskConfig.bundle.filename === 'string' ? taskConfig.bundle.filename : taskConfig.bundle.filename({ format, taskConfig, isES2017 })) :
          `${defaultFilenamePrefix}.production.js`,
      ),
      plugins: [
        minify && minifyPlugin({ sourceMaps }),
      ].filter(Boolean),
    });

    if (uncompressedDevelopment) {
      outputs.push({
        ...commonOption,
        file: join(
          outputDir,
          taskConfig?.bundle?.filename ?
            (
              typeof taskConfig.bundle.filename === 'string' ?
                taskConfig.bundle.filename :
                taskConfig.bundle.filename({ format, taskConfig, development: uncompressedDevelopment, isES2017 })
            ) :
            `${defaultFilenamePrefix}.development.js`,
        ),
      });
    }
  });

  return outputs;
};

function getExternalsAndGlobals(
  taskConfig: TaskConfig,
  pkg: PkgJson,
): [(id?: string) => boolean, Record<string, string>] {
  let externals: string[] = [];
  let globals: Record<string, string> = {};

  const builtinExternals = [
    'react/jsx-runtime',
    'core-js',
    'regenerator-runtime',
  ];

  const externalsConfig = taskConfig?.bundle?.externals ?? false;

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
  const { rootDir, userConfig, pkg, commandArgs } = ctx;
  const commonPlugins = [
    taskConfig?.babelPlugins && babelPlugin({ plugins: taskConfig.babelPlugins }),
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
      dtsPlugin(taskConfig.entry, userConfig?.generateTypesForJs),
      ...resolvedPlugins,
      ...commonPlugins,
      aliasPlugin({
        alias: taskConfig.alias || {},
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
      postcss({
        plugins: [autoprefixer()],
        extract: resolve(rootDir, outputDir, 'index.css'),
        autoModules: true,
        minimize: taskConfig.bundle.minify,
        sourceMap: userConfig?.sourceMaps,
      }),
      image(),
      json(),
      nodeResolve({ // To locates modules using the node resolution algorithm.
        extensions: [
          '.mjs', '.js', '.json', '.node', // plugin-node-resolve default extensions
          '.ts', '.tsx', '.mts', '.cjs', '.cts', // @ice/pkg default extensions
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

    const entry = isFile(taskConfig.entry) ?
      taskConfig.entry :
      findDefaultEntryFile(taskConfig.entry);

    if (!entry) {
      throw new Error(
        'Failed to resolve entry for current project.\n' +
        'This is most likely that \'src/index\' is not exist.\n' +
        'Whereas @ice/pkg treats it as the default option.',
      );
    }

    const [external, globals] = getExternalsAndGlobals(taskConfig, pkg as PkgJson);

    const resolvedRollupOptions = deepmerge.all([
      {
        input: entry,
        external,
        output: getRollupOutputs({
          globals,
          taskConfig,
          userConfig,
          pkg: pkg as PkgJson,
          outputDir: taskConfig.outputDir,
          isES2017: taskName === TaskName.BUNDLE_ES2017,
        }),
      },
      taskConfig.rollupOptions || {},
      {
        plugins: [
          // Custom plugins will add ahead
          ...(taskConfig?.rollupOptions?.plugins || []),
          ...resolvedPlugins,
        ],
      },
    ]);

    return [resolvedPlugins, resolvedRollupOptions];
  }
};
