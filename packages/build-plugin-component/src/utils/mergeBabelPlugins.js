module.exports = (defaultPlugins, babelPlugins) => {
  const pluginsMap = {};
  const createMap = item => {
    if (typeof item === 'string') {
      pluginsMap[item] = item;
    } else {
      const key = item[0];
      pluginsMap[key] = item
    }
  }
  defaultPlugins.map(createMap);
  babelPlugins.map(createMap);
  return Object.values(pluginsMap);
}
