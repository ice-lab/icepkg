import { extname, basename, relative, sep } from 'path';
import * as swc from '@swc/core';
import deepmerge from 'deepmerge';
import { isTypescriptOnly } from '../helpers/suffix.js';
import { checkDependencyExists, createScriptsFilter } from '../utils.js';

import type { Options as swcCompileOptions, Config, TsParserConfig, EsParserConfig } from '@swc/core';
import type { TaskConfig, OutputFile, BundleTaskConfig } from '../types.js';
import type { Plugin } from 'rollup';

const JSX_RUNTIME_SOURCE = '@ice/jsx-runtime';

const normalizeSwcConfig = (
  file: OutputFile,
  jsxRuntime: TaskConfig['jsxRuntime'],
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
          runtime: jsxRuntime,
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
    // Disable minimize on every file transform when bundling
    minify: false,
    swcrc: false,
    configFile: false,
  };

  return deepmerge.all([
    commonOptions,
    mergeOptions,
  ]);
};

/**
 * plugin-swc works as substitute of plugin-typescript, babel, babel-preset-env and plugin-minify.
 */
const swcPlugin = (
  jsxRuntime: TaskConfig['jsxRuntime'],
  rootDir: string,
  extraSwcOptions?: Config,
  compileDependencies?: BundleTaskConfig['compileDependencies'],
): Plugin => {
  const scriptsFilter = createScriptsFilter(compileDependencies);
  return {
    name: 'ice-pkg:swc',

    async transform(source, id) {
      if (!scriptsFilter(id)) {
        return null;
      }

      const file = {
        filePath: id,
        absolutePath: id,
        ext: extname(id),
      };
      // If file's name comes with .mjs、.mts、.cjs、.cts suffix
      const destExtname = ['m', 'c'].includes(file.ext[1]) ? `.${file.ext[1]}js` : '.js';
      const destFilename = basename(id).replace(RegExp(`${extname(id)}$`), destExtname);
      const { code, map } = await swc.transform(
        source,
        normalizeSwcConfig(file, jsxRuntime, {
          ...extraSwcOptions,
          // If filename is omitted, will lose filename info in sourcemap.
          // e.g: ./src/index.mts
          sourceFileName: `.${sep}${relative(rootDir, id)}`,
          filename: id,
        }),
      );

      return {
        code,
        map,
        meta: {
          filename: destFilename,
        },
      };
    },
    options(options) {
      const { onwarn } = options;
      options.onwarn = (warning, warn) => {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source.includes(JSX_RUNTIME_SOURCE)) {
          checkDependencyExists(JSX_RUNTIME_SOURCE, 'https://pkg.ice.work/faq');
        }
        if (onwarn) {
          onwarn(warning, warn);
        } else {
          warn(warning);
        }
      };
    },
  };
};

export default swcPlugin;
