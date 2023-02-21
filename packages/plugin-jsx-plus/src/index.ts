import type { Plugin } from '@ice/pkg';

interface PluginOptions {
  moduleName?: 'react' | 'rax';
}

const defaultPluginOptions: PluginOptions = {
  moduleName: 'react',
};

const plugin: Plugin = (api, rawOptions?: PluginOptions) => {
  const { onGetConfig } = api;
  const pluginOptions = Object.assign({}, defaultPluginOptions, rawOptions);
  const babelPlugins = [
    'babel-plugin-transform-jsx-list',
    'babel-plugin-transform-jsx-condition',
    'babel-plugin-transform-jsx-memo',
    'babel-plugin-transform-jsx-slot',
    ['babel-plugin-transform-jsx-fragment', { moduleName: pluginOptions.moduleName }],
    'babel-plugin-transform-jsx-class',
  ];

  onGetConfig((config) => {
    config.babelPlugins ??= [];
    config.babelPlugins.push(...babelPlugins);
  });
};

export default plugin;
