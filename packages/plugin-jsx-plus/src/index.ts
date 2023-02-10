import type { Plugin } from '@ice/pkg';

const babelPlugins = [
  'babel-plugin-transform-jsx-list',
  'babel-plugin-transform-jsx-condition',
  'babel-plugin-transform-jsx-memo',
  'babel-plugin-transform-jsx-slot',
  ['babel-plugin-transform-jsx-fragment', { moduleName: 'react' }],
  'babel-plugin-transform-jsx-class',
];

const plugin: Plugin = (api) => {
  const { onGetConfig } = api;

  onGetConfig((config) => {
    config.babelPlugins ??= [];
    config.babelPlugins.push(...babelPlugins);
  });
};

export default plugin;
