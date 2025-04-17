import { Plugin } from '@ice/pkg';
const plugin: Plugin = (api) => {
  api.registerFormat('asset', (options) => {
    if (options.type !== 'bundle') {
      return;
    }
    return {
      type: 'bundle',
      formats: [{ module: 'umd', target: 'es2017' }],
      modifyRollupOptions: [
        (options) => {
          [].concat(options.output!).forEach((output) => {
            output.assetFileNames = '[name].asset.[ext]';
            output.entryFileNames = output.chunkFileNames = '[name].asset.js';
          });
          return options;
        },
      ],
    };
  });

  api.modifyUserConfig((userConfig) => {
    userConfig.bundle ??= {};
    userConfig.bundle.formats ??= [];
    userConfig.bundle.formats.push('asset');
    return userConfig;
  });
};

export default plugin;
