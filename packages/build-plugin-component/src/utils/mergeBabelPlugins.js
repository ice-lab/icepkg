module.exports = (defaultPlugins, babelPlugins) => {
  const pluginsMap = {};
  // 把插件名作为key，pluginsMap不存在key则新增插件，存在则覆盖插件
  const appendNewPluginsToMap = item => {
    if (typeof item === 'string') {
      pluginsMap[item] = item;
    } else {
      const key = item[0];
      pluginsMap[key] = item
    }
  }
  // 默认插件存入pluginsMap
  defaultPlugins.map(appendNewPluginsToMap);
  // 业务自定义插件存入pluginsMap
  babelPlugins.map(appendNewPluginsToMap);
  return Object.values(pluginsMap);
}
