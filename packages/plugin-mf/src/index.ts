import type { Plugin } from '@ice/pkg';
import { type ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export type PluginOptions = ModuleFederationOptions;

const plugin: Plugin = (api, rawOptions?: PluginOptions) => {
  api.onGetConfig((config) => {
    if (config.type === 'bundle' && config.formats.some((v) => v.module === 'mf')) {
      if (config.engine !== 'rslib') {
        if (config.engine) {
          console.warn('[@ice/pkg-plugin-mf] only support rslib engine. Will force use rslib engine.');
        }
        config.engine = 'rslib';
      }
      config.modifyRslibConfig ??= [];
      config.modifyRslibConfig.push((rslibConfig) => {
        rslibConfig.lib[0].plugins ??= [];
        rslibConfig.lib[0].plugins.push(
          require('@module-federation/rsbuild-plugin').pluginModuleFederation(rawOptions),
        );
        return rslibConfig;
      });
    }
  });
};

export default plugin;

export function mf(options: PluginOptions = {}): Plugin {
  return (api) => {
    // NOTE: type bypass
    (plugin as any)(api, options);
  };
}
