import { extname } from 'path';
import * as swc from '@swc/core';
import deepmerge from 'deepmerge';
import { isTypescriptOnly } from '../helpers/suffix.js';
import { checkDependencyExists, scriptsFilter } from '../utils.js';

import type { Options as swcCompileOptions, Config, TsParserConfig, EsParserConfig } from '@swc/core';
import type { TaskConfig, OutputFile } from '../types.js';
import type { Plugin } from 'rollup';

const JSX_RUNTIME_SOURCE = '@ice/jsx-runtime';

const normalizeSwcConfig = (
  file: OutputFile,
  type: TaskConfig['type'],
  mergeOptions?: swcCompileOptions,
): swcCompileOptions => {
  const { filePath, ext } = file;
  const isTypeScript = isTypescriptOnly(ext, filePath);
  const syntaxFeatures = {
    decorators: true,
  };
  const tsSyntaxFeatures: TsParserConfig = {
    syntax: 'typescript',
    tsx: true,
  };
  const jsSyntaxFeatures: EsParserConfig = {
    syntax: 'ecmascript',
    jsx: true,
  };
  const commonOptions: swcCompileOptions = {
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
          importSource: JSX_RUNTIME_SOURCE,
        },
        legacyDecorator: true,
      },
      parser: {
        ...syntaxFeatures,
        ...(isTypeScript ? tsSyntaxFeatures : jsSyntaxFeatures),
      },
      externalHelpers: false,
      loose: false, // Not recommend
    },
    minify: false,
  };

  return deepmerge.all([
    commonOptions,
    mergeOptions,
  ]);
};

/**
 * plugin-swc works as substitute of plugin-typescript, babel, babel-preset-env and plugin-minify.
 */
const swcPlugin = (type: TaskConfig['type'], extraSwcOptions?: Config): Plugin => {
  return {
    name: 'ice-pkg:swc',

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
        // Additional option to re-define extname
        meta: {
          // If file's name comes with .mjs、.mts、.cjs、.cts suffix
          ext: ['m', 'c'].includes(file.ext[1]) ? `.${file.ext[1]}js` : '.js',
        },
      };
    },
    options(options) {
      options.onwarn = (warning, warn) => {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source.includes(JSX_RUNTIME_SOURCE)) {
          checkDependencyExists(JSX_RUNTIME_SOURCE, 'https://pkg.ice.work/faq');
        }
        warn(warning);
      };
    },
  };
};

export default swcPlugin;
