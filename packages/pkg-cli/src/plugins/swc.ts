import { resolve, extname, dirname, join } from 'path';
import fs from 'fs-extra';
import * as swc from '@swc/core';
import deepmerge from 'deepmerge';
import { isTypescriptOnly } from '../helpers/suffix.js';
import { isDirectory, scriptsFilter } from '../utils.js';

import type { Options as swcCompileOptions, Config, JsMinifyOptions } from '@swc/core';
import type { RollupPluginFn } from '../types.js';
import type { File } from '../loaders/transform.js';

const normalizeSwcConfig = (
  file: File,
  mergeOptions?: swcCompileOptions,
): swcCompileOptions => {
  const { filePath, ext } = file;
  const isTypeScript = isTypescriptOnly(ext, filePath);

  const commonOptions: swcCompileOptions = {
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
        legacyDecorator: true,
      },
      externalHelpers: false,
      loose: false, // No recommand
    },
    minify: false,
    sourceMaps: false,
  };

  if (isTypeScript) {
    return deepmerge.all([
      commonOptions,
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
        },
      },
      mergeOptions,
    ]);
  }

  return deepmerge.all([
    commonOptions,
    {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          tsx: true,
          decorators: true,
        },
      },
    },
    mergeOptions,
  ]);
};

const RESOLVE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.mts', '.cjs'];

const resolveFile = (importee: string, isDir = false) => {
  for (let i = 0; i < RESOLVE_EXTENSIONS.length; ++i) {
    const path = isDir ? join(importee, `index${RESOLVE_EXTENSIONS[i]}`) : `${importee}${RESOLVE_EXTENSIONS[i]}`;
    const exist = fs.pathExistsSync(path);

    if (exist) return path;
  }
};

export interface SwcPluginArgs {
  extraSwcOptions?: Config;
  minifyWhenTransform?: boolean;
}

/**
 * plugin-swc works as substitute of plugin-typescript, babel, babel-preset-env and plugin-minify.
 * @param ctx
 * @returns
 */
const swcPlugin: RollupPluginFn<SwcPluginArgs> = ({
  extraSwcOptions,
  minifyWhenTransform = false,
}) => {
  return {
    name: 'ice-pkg-cli:swc',

    resolveId(importee: string, importer?: string) {
      // Narrow importee from filters
      if (!scriptsFilter(importer)) {
        return null;
      }

      // Find relative importee
      if (importer && importee[0] === '.') {
        // Path may be a folder
        const absolutePath = resolve(
          importer ? dirname(importer) : process.cwd(),
          importee,
        );

        let resolvedPath = resolveFile(absolutePath);

        if (!resolvedPath &&
          fs.pathExistsSync(absolutePath) &&
          isDirectory(absolutePath)) {
          resolvedPath = resolveFile(absolutePath, true);
        }

        return resolvedPath;
      }
    },

    transform(_, id) {
      if (!scriptsFilter(id)) {
        return null;
      }

      const file = {
        filePath: id,
        absolutePath: id,
        ext: extname(id),
      };

      const { code, map } = swc.transformSync(
        _,
        normalizeSwcConfig(file, {
          ...extraSwcOptions,
          // Disable minimize on every file transform when bundling,
          // While needs when tranforming
          minify: minifyWhenTransform ? extraSwcOptions.minify : false,
          // If filename is omitted, will lose filename info in sourcemap
          filename: id,
        }),
      );

      return {
        code,
        map,
        // Addtional option to re-define extname
        meta: {
          // If file's name comes with .mjs、.mts、.cjs、.cts suffix
          ext: ['m', 'c'].includes(file.ext[1]) ? `.${file.ext[1]}js` : '.js',
        },
      };
    },

    renderChunk(_) {
      // 这个 Hook 仅在 bunlde 时生效，bundle 时利用这个 hook 进行 minify
      if (extraSwcOptions.minify) {
        return swc.minifySync(_, {
          ...(extraSwcOptions.minify as JsMinifyOptions),
          sourceMap: !!extraSwcOptions.sourceMaps,
        });
      }
      return null;
    },
  };
};

export default swcPlugin;
