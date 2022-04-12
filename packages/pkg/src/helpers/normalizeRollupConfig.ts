import { join, resolve } from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import deepmerge from 'deepmerge';
import { isFile, findDefaultEntryFile } from '../utils.js';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import autoprefixer from 'autoprefixer';
import swcPlugin from '../plugins/swc.js';
import dtsPlugin from '../plugins/dts.js';
import minify from '../plugins/minify.js';
import babelPlugin from '../plugins/babel.js';
import { builtinNodeModules } from './builtinModules.js';

import type { Plugin as RollupPlugin, RollupOptions, OutputOptions } from 'rollup';
import type { TaskConfig, PkgContext, TaskName, UserConfig } from '../types.js';

const getRollupOutputs = ({
  userConfig,
  pkg,
  outputDir,
  isES2017,
}: {
  userConfig: UserConfig;
  outputDir: string;
  pkg: any;
  isES2017: boolean;
}): OutputOptions[] => {
  const outputs: OutputOptions[] = [];

  const uncompressedDevelopment = userConfig?.bundle?.development;
  const outputFormats = (userConfig?.bundle?.formats || []).filter((format) => format !== 'es2017') as Array<'umd' | 'esm'>;

  const filename = userConfig?.bundle?.filename ?? 'index';
  const name = userConfig?.bundle?.name ?? pkg.name;

  outputFormats.forEach((format) => {
    const commonOption = {
      name,
      format,
      sourcemap: userConfig?.sourceMaps ?? false,
    };

    const filenamePrefix = `${filename}${format === 'umd' ? '.umd' : ''}${isES2017 ? '.es2017' : ''}`;
    outputs.push({
      ...commonOption,
      file: join(outputDir, `${filenamePrefix}.production.js`),
      plugins: [minify({ minifyOption: true })],
    });

    if (uncompressedDevelopment) {
      outputs.push({
        ...commonOption,
        file: join(outputDir, `${filenamePrefix}.development.js`),
      });
    }
  });

  return outputs;
};

const getExternalsAndGlboals = (userConfig: UserConfig, pkg: any) => {
  let externals: string[] = [];

  const builtinExternals = [
    'react/jsx-runtime',
    'core-js',
  ];

  switch (userConfig?.bundle?.externals ?? true) {
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
      break;
  }

  const externalPredicate = new RegExp(`^(${externals.map(escapeStringRegexp).join('|')})($|/)`);

  const externalFun = externals.length === 0
    ? () => false
    : (id: string) => externalPredicate.test(id);

  return externalFun;
};

export const normalizeRollupConfig = (
  cfg: TaskConfig,
  ctx: PkgContext,
  taskName: TaskName,
): [RollupPlugin[], RollupOptions] => {
  const { swcCompileOptions, type, outputDir, rollupPlugins, rollupOptions } = cfg;
  const { rootDir, userConfig, pkg } = ctx;

  const commonPlugins = [
    // @ts-ignore FIXME: fix alias
    userConfig?.alias && alias({ entries: userConfig.alias }),
    userConfig?.babelPlugins?.length && babelPlugin(userConfig.babelPlugins),
    swcPlugin({
      extraSwcOptions: swcCompileOptions,
    }),
  ].filter(Boolean);

  let resolvedPlugins = rollupPlugins ?? [];

  if (type === 'transform') {
    resolvedPlugins = [
      ...resolvedPlugins,
      ...commonPlugins,
      dtsPlugin(cfg.entry, userConfig?.generateTypesForJs),
    ];

    return [resolvedPlugins, rollupOptions];
  }

  if (type === 'bundle') {
    resolvedPlugins = [
      ...resolvedPlugins,
      ...commonPlugins,
      postcss({
        plugins: [autoprefixer()],
        extract: resolve(rootDir, outputDir, 'index.css'),
        autoModules: true,
        minimize: true,
        sourceMap: userConfig?.sourceMaps,
      }),
      nodeResolve(), // To locates modules using the node resolution algorithm,
      commonjs(), // To convert commonjs to import, make it capabile for rollup to bundle
    ];

    const entry = isFile(cfg.entry) ? cfg.entry : findDefaultEntryFile(cfg.entry);

    if (!entry) {
      throw new Error(
        'Failed to resolve entry for current project.\n' +
        'This is most likely that \'src/index\' is not exist.\n' +
        'Whereas @ice/pkg treats it as the default option.',
      );
    }

    const external = getExternalsAndGlboals(userConfig, pkg);

    const resolvedRollupOptions = deepmerge.all([
      {
        input: entry,
        external,
        output: getRollupOutputs({
          userConfig,
          pkg,
          outputDir: cfg.outputDir,
          isES2017: taskName === 'pkg-dist-es2017',
        }),
      },
      cfg.rollupOptions || {},
      {
        plugins: [
          // Custom plugins will add ahead
          ...(cfg?.rollupOptions?.plugins || []),
          ...resolvedPlugins,
        ],
      },
    ]);

    return [resolvedPlugins, resolvedRollupOptions];
  }
};
