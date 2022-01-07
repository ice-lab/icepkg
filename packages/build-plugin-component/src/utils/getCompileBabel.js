const { getBabelConfig } = require('build-scripts-config');
const formatPathForWin = require('./formatPathForWin');

module.exports = (options = {}, { babelPlugins, babelOptions, rootDir }) => {
  const { modules } = options;

  const defaultBabel = getBabelConfig();

  const additionalPlugins = [
    [require.resolve('@babel/plugin-transform-runtime'), {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
    [require.resolve('@babel/plugin-proposal-private-methods'), { loose: true }],
    [require.resolve('@babel/plugin-proposal-private-property-in-object'), { loose: true }],
  ];

  const formatedBabelPlugins = (babelPlugins || []).map((plugin) => {
    const [pluginName, pluginOptions, ...restOptions] = Array.isArray(plugin) ? plugin : [plugin];
    // 用户自定义的 babelPlugins 需要从项目目录寻址
    const pluginPath = require.resolve(pluginName, { paths: [rootDir] });
    return pluginOptions ? [pluginPath, pluginOptions, ...(restOptions || [])] : pluginPath;
  });

  defaultBabel.plugins = [...defaultBabel.plugins, ...additionalPlugins, ...formatedBabelPlugins];

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
