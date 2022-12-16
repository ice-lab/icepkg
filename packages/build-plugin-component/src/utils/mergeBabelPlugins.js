function mergeBabelPlugins(defaultPlugins = [], customPlugins = []) {
  const plugins = {};
  // Use the plugin name as the key. If the pluginsMap does not exist, 
  // the plugin will be added, and if it exists, the plugin will be 
  // overwritten.
  const addPlugin = (plugin) => {
    if (typeof plugin === 'string') {
      plugins[plugin] = plugin;
    } else if (Array.isArray(plugin)) {
      const key = plugin[0];
      plugins[key] = plugin;
    } else {
      console.warn('Unknown plugin description:', plugin);
    }
  }

  // Default plugins.
  defaultPlugins.forEach(addPlugin);
  // Custom plugins.
  customPlugins.forEach(addPlugin);

  return Object.values(plugins);
}

module.exports = mergeBabelPlugins;
