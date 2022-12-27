import { BundleTaskConfig, TaskName } from '@ice/pkg';
import type { Plugin } from '@ice/pkg';

const plugin: Plugin = (api) => {
  const { onGetConfig } = api;

  const bundleTaskCallback: Parameters<typeof onGetConfig>[0] = async (config: BundleTaskConfig) => {
    // if (config.type === 'transform') {
    //   return;
    // }
    config.extensions = [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
      '.html',
    ];
    config.entry = {
      avatar: './src/Avatar/index',
      button: './src/Button/index',
    };
    // config.sourcemap = true;
    config.alias = { ...config.alias };
    config.externals = { react: 'React', 'react-dom': 'ReactDOM' };

    config.modifyStylesOptions ??= [];
    config.modifyRollupOptions.push((options) => {
      return options;
    });
  };

  onGetConfig(TaskName.BUNDLE_ES2017, bundleTaskCallback);
  onGetConfig(TaskName.BUNDLE_ES5, bundleTaskCallback);
};

export default plugin;
