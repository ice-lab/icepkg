/**
 * This plugin is used to be as a supplement for swc.
 */
import * as babel from '@babel/core';
import type { ParserPlugin } from '@babel/parser';
import { Plugin } from 'rollup';
import { scriptsFilter } from '../utils.js';

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
interface BabelPluginOptions {
  pragma?: string;
  pragmaFrag?: string;
}

const babelPlugin = (plugins: babel.PluginItem[], options: BabelPluginOptions): Plugin => {
  // https://babeljs.io/docs/en/babel-preset-react#usage
  const {
    pragma = 'React.createElement',
    pragmaFrag = 'React.Fragment',
  } = options;
  return {
    name: 'ice-pkg:babel',

    transform(source, id) {
      if (!scriptsFilter(id)) {
        return null;
      }

      const parserPlugins = getParserPlugins(/\.tsx?$/.test(id));

      const { code, map } = babel.transformSync(source, {
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
        plugins,
        presets: [
          [
            '@babel/preset-typescript',
            {
              isTSX: /\.tsx?$/.test(id),
              allExtensions: true,
              jsxPragma: pragma,
              jsxPragmaFrag: pragmaFrag,
            },
          ],
          [
            '@babel/preset-react',
            {
              pragma,
              pragmaFrag,
              throwIfNamespace: false,
            },
          ],
        ],
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
