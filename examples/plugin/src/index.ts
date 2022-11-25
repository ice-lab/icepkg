import { TaskName } from '@ice/pkg';
import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(TaskName.BUNDLE_ES2017, async (config) => {
    config.extensions = [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
      '.html',
    ];
    return config;
  });
  onGetConfig(TaskName.BUNDLE_ES5, async (config) => {
    config.extensions = [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
      '.html',
    ];
    return config;
  });
};

export default plugin;
