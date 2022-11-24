import { TaskName } from '@ice/pkg';
import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(TaskName.BUNDLE_ES2017, async (config) => {
    console.log('config===>', config);
    config.extensions = [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
      '.html',
    ];
  });
  onGetConfig(TaskName.BUNDLE_ES5, async (config) => {
    console.log('config===>', config);
  });
};

export default plugin;
