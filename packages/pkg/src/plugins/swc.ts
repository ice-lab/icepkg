import { resolve, extname, dirname, join } from 'path';
import fs from 'fs-extra';
import * as swc from '@swc/core';
import deepmerge from 'deepmerge';
import { isTypescriptOnly } from '../helpers/suffix.js';
import { isDirectory, scriptsFilter, cwd } from '../utils.js';

import type { Options as swcCompileOptions, Config } from '@swc/core';
import type { TaskConfig, RollupPluginFn, OutputFile } from '../types.js';

const normalizeSwcConfig = (
  file: OutputFile,
  type: TaskConfig['type'],
  mergeOptions?: swcCompileOptions,
): swcCompileOptions => {
  const { filePath, ext } = file;
  const isTypeScript = isTypescriptOnly(ext, filePath);

  const commonOptions: swcCompileOptions = {
    jsc: {
      transform: {
        react: {
          // In bundle task use classic runtime because of convenience for external react
          // In transform task use automatic runtime so it isn't necessary to import react
          runtime: type === 'transform' ? 'automatic' : 'classic',
        },
        legacyDecorator: true,
      },
      externalHelpers: false,
      loose: false, // No recommand
    },
    minify: false,
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
  const ext = extname(importee);
  if (ext === '') {
    for (let i = 0; i < RESOLVE_EXTENSIONS.length; ++i) {
      const path = isDir ? join(importee, `index${RESOLVE_EXTENSIONS[i]}`) : `${importee}${RESOLVE_EXTENSIONS[i]}`;
      const exist = fs.pathExistsSync(path);

      if (exist) return path;
    }
  }

  // File should suffix with `.js` in TypeScript project.
  if (ext === '.js') {
    const exist = fs.pathExistsSync(importee);
    // Leave other plugins to resolve it.
    if (exist) return null;

    const tsFilePath = importee.replace('.js', '.ts');
    const tsExist = fs.pathExistsSync(tsFilePath);

    if (tsExist) return tsFilePath;
  }
};

export interface SwcPluginArgs {
  type: TaskConfig['type'];
  extraSwcOptions?: Config;
}

/**
 * plugin-swc works as substitute of plugin-typescript, babel, babel-preset-env and plugin-minify.
 * @param ctx
 * @returns
 */
const swcPlugin: RollupPluginFn<SwcPluginArgs> = ({
  type,
  extraSwcOptions,
}) => {
  return {
    name: 'ice-pkg:swc',

    resolveId(importee: string, importer?: string) {
      // Narrow importee from filters
      if (!scriptsFilter(importer)) {
        return null;
      }

      // Find relative importee
      if (importer && importee[0] === '.') {
        const absolutePath = resolve(
          importer ? dirname(importer) : cwd,
          importee,
        );

        let resolvedPath = resolveFile(absolutePath);

        // Path may be a folder
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
        normalizeSwcConfig(file, type, {
          ...extraSwcOptions,
          // Disable minimize on every file transform when bundling
          minify: false,
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
  };
};

export default swcPlugin;
