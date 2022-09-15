module.exports = (defaultPlugins, babelPlugins) => {
  const pluginsMap = {};
  const appendNewPluginsToMap = item => {
    if (typeof item === 'string') {
      pluginsMap[item] = item;
    } else {
      const key = item[0];
      pluginsMap[key] = item
    }
  }
  defaultPlugins.map(appendNewPluginsToMap);
  babelPlugins.map(appendNewPluginsToMap);
  return Object.values(pluginsMap);
}
