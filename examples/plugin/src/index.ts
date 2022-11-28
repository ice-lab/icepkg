import { TaskName } from '@ice/pkg';
import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const { onGetConfig } = api;
  const bundleTaskCallback: Parameters<typeof onGetConfig>[0] = async (config) => {
    config.extensions = [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
      '.html',
    ];
    config.alias = { ...config.alias };
    config.bundle.externals = { react: 'React', 'react-dom': 'ReactDOM' };
    // config.bundle.filename = ({ format, development, isES2017 }) => {
    //   return `index${(format === 'umd' || format === 'cjs') ? `.${format}` : ''}${isES2017 ? '-2017' : ''}${development ? 'development' : ''}.js`;
    // };
    return config;
  };
  onGetConfig(TaskName.BUNDLE_ES2017, bundleTaskCallback);
  onGetConfig(TaskName.BUNDLE_ES5, bundleTaskCallback);
};

export default plugin;
