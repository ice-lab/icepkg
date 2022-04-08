import { join, resolve } from 'path';
import deepmerge from 'deepmerge';
import { isFile, findDefaultEntryFile, addSuffixToFile } from '../utils.js';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import autoprefixer from 'autoprefixer';
import { loadPkg } from './load.js';
import swcPlugin from '../plugins/swc.js';
import dtsPlugin from '../plugins/dts.js';
import babelPlugin from '../plugins/babel.js';

import type { Plugin as RollupPlugin, RollupOptions } from 'rollup';
import type { ComponentConfig, ComponentContext } from '../types.js';

export const normalizeRollupConfig = (
  cfg: ComponentConfig,
  ctx: ComponentContext,
): [RollupPlugin[], RollupOptions] => {
  const { swcCompileOptions, type, outputDir, rollupPlugins, rollupOptions } = cfg;
  const { rootDir, userConfig } = ctx;

  const commonPlugins = [
    userConfig?.alias && alias({ entries: userConfig.alias }),
    userConfig?.babelPlugins?.length && babelPlugin(userConfig.babelPlugins),
    swcPlugin({
      extraSwcOptions: swcCompileOptions,
      minifyWhenTransform: type === 'transform',
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
        minimize: userConfig?.umd?.minify ?? userConfig?.minify,
        sourceMap: userConfig?.umd?.sourceMaps ?? userConfig?.sourceMaps,
      }),
      nodeResolve(), // To locates modules using the node resolution algorithm,
      commonjs(), // To convert commonjs to import, make it capabile for rollup to bundle
    ];

    const umdConfig = userConfig?.umdConfig;

    const entry = isFile(cfg.entry) ? cfg.entry : findDefaultEntryFile(cfg.entry);

    if (!entry) {
      throw new Error(
        'Failed to resolve entry for current project.\n' +
        'This is most likely that \'src/index\' is not exist.\n' +
        'Whereas @ice/pkg treats it as the default option.',
      );
    }

    const resolvedRollupOptions = deepmerge.all([
      {
        input: entry,
        output: {
          format: 'umd',
          name: umdConfig?.name || loadPkg(rootDir).name,
          file: join(cfg.outputDir, addSuffixToFile(umdConfig?.filename ?? 'index.js')),
          sourcemap: umdConfig?.sourceMaps || true,
        },
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
