const { getBabelConfig } = require('build-scripts-config');
const formatPathForWin = require('./formatPathForWin');

module.exports = (options = {}, { babelPlugins, babelOptions, rootDir }) => {
  const { modules } = options;

  const defaultBabel = getBabelConfig();

  const additionalPlugins = [
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ];

  defaultBabel.plugins = [...defaultBabel.plugins, ...additionalPlugins, ...((babelPlugins || []).map((plugin) => {
    const [plguinName, pluginOptions, ...restOptions] = Array.isArray(plugin) ? plugin : [plugin];
    const pluginPath = require.resolve(plguinName, { paths: [rootDir] });
    if (pluginOptions) {
      return [
        pluginPath,
        pluginOptions,
        ...(restOptions || []),
      ];
    } else {
      return pluginPath;
    }
  }))];
  // modify @babel/preset-env options
  defaultBabel.presets = defaultBabel.presets.map((preset) => {
    const [presetPath, presetOptions] = Array.isArray(preset) ? preset : [preset];
    const targetConfig = babelOptions.find(({ name }) => (formatPathForWin(presetPath).indexOf(name) > -1));
    const modifyOptions = targetConfig && targetConfig.options;

    if (formatPathForWin(presetPath).indexOf('@babel/preset-env') > -1) {
      // default preset-env options for component compile
      return [presetPath, { modules, loose: true, ...(modifyOptions || {}) }];
    }
    if (presetOptions && modifyOptions) {
      return [presetPath, { ...presetOptions, ...modifyOptions }];
    }
    return preset;
  });
  return defaultBabel;
};
