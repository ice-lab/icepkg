/**
 * This plugin is used to be as a supplement for swc.
 */
import * as babel from '@babel/core';
import type { ParserPlugin } from '@babel/parser';
import { Plugin } from 'rollup';
import { createScriptsFilter, formatCnpmDepFilepath, getIncludeNodeModules } from '../utils.js';
import type { BundleTaskConfig } from '../types.js';
import { TransformOptions } from '@babel/core';
import getBabelOptions from '../helpers/getBabelOptions.js';

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

const babelPlugin = (
  plugins: babel.PluginItem[],
  options: BabelPluginOptions,
  compileDependencies?: BundleTaskConfig['compileDependencies'],
  modifyBabelOptions?: (babelCompileOptions: TransformOptions) => TransformOptions,
): Plugin => {
  // https://babeljs.io/docs/en/babel-preset-react#usage
  const babelOptions = getBabelOptions(plugins, options, modifyBabelOptions);
  const scriptsFilter = createScriptsFilter(getIncludeNodeModules(compileDependencies));
  return {
    name: 'ice-pkg:babel',

    transform(source, id) {
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
    },
  };
};

export default babelPlugin;
