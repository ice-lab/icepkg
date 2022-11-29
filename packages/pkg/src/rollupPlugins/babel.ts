/**
 * This plugin is used to be as a supplement for swc.
 */
import * as babel from '@babel/core';
import type { ParserPlugin } from '@babel/parser';
import { Plugin } from 'rollup';
import { scriptsFilter } from '../utils.js';

const getParserPlugins = (isTs?: boolean): ParserPlugin[] => {
  const commonPlugins: ParserPlugin[] = [
    'jsx',
    'importMeta',
    'topLevelAwait',
    'classProperties',
    'classPrivateMethods',
  ];

  if (isTs) {
    return [
      ...commonPlugins,
      'typescript',
      'decorators-legacy',
    ];
  }

  return commonPlugins;
};

const babelPlugin = (babelPlugins: babel.PluginItem[]): Plugin => {
  return {
    name: 'ice-pkg:babel',

    transform(source, id) {
      if (!scriptsFilter(id)) {
        return null;
      }

      const parserPlugins = getParserPlugins(/\.tsx?$/.test(id));

      const { code, map } = babel.transformSync(source, {
        ast: false, // No need to return ast
        babelrc: false,
        configFile: false,
        filename: id,
        parserOpts: {
          sourceType: 'module',
          plugins: parserPlugins,
        },
        generatorOpts: {
          decoratorsBeforeExport: true,
        },
        plugins: babelPlugins ?? [],
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
