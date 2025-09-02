// Only for pkg config plugin
import { Plugin } from '@ice/pkg';
const plugin: Plugin = (api) => {
  api.onGetConfig((config) => {
    config.define = {
      ...config.define,
      __PLUGIN_INFO__: JSON.stringify({
        name: 'pkg-config',
      }),
    };
    console.log('config', config);
  });
};

export default plugin;
