/**
 * This plugin is used to be as a supplement for swc.
 */
import * as babel from '@babel/core';
import { scriptsFilter } from '../utils.js';

const getParserPlugins = (isTs?: boolean) => {
  const commonPlugins = [
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

const babelPlugin = (babelPlugins) => {
  return {
    name: 'ice-pkg:babel',

    transform(code, id) {
      if (!scriptsFilter(id)) {
        return null;
      }

      const parserPlugins = getParserPlugins(/\.tsx?$/.test(id));

      return babel.transformSync(code, {
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
    },
  };
};

export default babelPlugin;
