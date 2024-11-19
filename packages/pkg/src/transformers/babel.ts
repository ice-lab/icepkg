/**
 * This plugin is used to be as a supplement for swc.
 */
import * as babel from '@babel/core';
import type { ParserPlugin } from '@babel/parser';
import { formatCnpmDepFilepath, getIncludeNodeModuleScripts } from '../utils.js';
import type { BundleTaskConfig } from '../types.js';
import { TransformOptions } from '@babel/core';
import getBabelOptions from '../helpers/getBabelOptions.js';
import { CompileTransformer } from './compose.js';
import { createScriptsFilter } from '../helpers/filter.js';

const getParserPlugins = (isTS?: boolean): ParserPlugin[] => {
  const commonPlugins: ParserPlugin[] = [
    'jsx',
    'importMeta',
    'topLevelAwait',
    'classProperties',
    'classPrivateMethods',
  ];

  if (isTS) {
    return [
      ...commonPlugins,
      'typescript',
      'decorators-legacy',
    ];
  }

  return commonPlugins;
};
export interface BabelPluginOptions {
  pragma?: string;
  /** @default automatic */
  jsxRuntime?: 'classic' | 'automatic';
  pragmaFrag?: string;
}

export interface BabelTransformerOptions {
  babelPlugins?: babel.PluginItem[],
  babelOptions?: BabelPluginOptions,
  compileDependencies?: BundleTaskConfig['compileDependencies'],
  modifyBabelOptions?: (babelCompileOptions: TransformOptions) => TransformOptions,
}

export function babelTransformer(
  { babelOptions: options, babelPlugins: plugins, compileDependencies, modifyBabelOptions}: BabelTransformerOptions
): CompileTransformer {
  if (!plugins || !options) {
    return async () => null
  }
  // https://babeljs.io/docs/en/babel-preset-react#usage
  const babelOptions = getBabelOptions(plugins, options, modifyBabelOptions);
  const scriptsFilter = createScriptsFilter(getIncludeNodeModuleScripts(compileDependencies));
  return async (source, id) => {
      if (!scriptsFilter(formatCnpmDepFilepath(id))) {
        return null;
      }

      const parserPlugins = getParserPlugins(/\.tsx?$/.test(id));

      const { code, map } = babel.transformSync(source, {
        ...babelOptions,
        babelrc: false,
        configFile: false,
        filename: id,
        parserOpts: {
          sourceType: 'module',
          plugins: parserPlugins,
        },
        sourceFileName: id,
      });
      return {
        code,
        map,
      };
    }
};
