// Only for pkg config plugin
import { Plugin } from '@ice/pkg';
const plugin: Plugin = (api) => {
  api.onGetConfig((config) => {
    config.define = {
      ...config.define,
      __PLUGIN_INFO__: JSON.stringify({
        pluginScope: api.pluginScope,
      }),
    };
  });
};

export default plugin;
