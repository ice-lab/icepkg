import { doc } from './doc.mjs';
import { configureDocusaurus } from './configureDocusaurus.mjs';
import genDemoPages from './genDemoPages/index.mjs';
import type { EnableConfig, PluginDocusaurusOptions } from './types.mjs';
import type { Plugin } from '@ice/pkg';

const DEFAULT_DEV_SERVER_PORT = 4000;

const defaultOptions: PluginDocusaurusOptions = {
  title: 'ICE PKG',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  path: 'docs',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',
  navBarLogo: 'https://img.alicdn.com/imgextra/i1/O1CN01lZTSIX1j7xpjIQ3fJ_!!6000000004502-2-tps-160-160.png',
  navBarTitle: 'ICE PKG',
  port: undefined,
  defaultLocale: 'zh-Hans',
  locales: ['zh-Hans'],
};

const plugin: Plugin = (api, options: PluginDocusaurusOptions = {}) => {
  const { onHook, context, getAllPlugin } = api;
  const { command, rootDir } = context;
  const { enable = true } = options;
  if (!checkPluginEnable(enable, command)) {
    return;
  }

  const configuredPlugins = getAllPlugin();
  const pluginOptions = {
    ...defaultOptions,
    ...options,
    configuredPlugins,
  };

  configureDevServerPort(pluginOptions);

  configureDocusaurus(rootDir, pluginOptions);

  onHook(`before.${command}.run`, async () => {
    if (command === 'build') {
      // Pages must be generated before build
      // because remark plugin of docusaurus-plugin-content-docs works after docusaurus-plugin-content-pages reads the pages dir
      genDemoPages(rootDir);
    }
    await doc(api, pluginOptions);
  });
};

const checkPluginEnable = (enable: boolean | EnableConfig, command: string): boolean => {
  if (typeof enable === 'boolean') {
    if (!enable) {
      return false;
    }
  } else if (!enable[command]) {
    return false;
  }
  return true;
};

function configureDevServerPort(options: PluginDocusaurusOptions) {
  // Port from environment variable is preferred.
  if (process.env.PORT) {
    const envPort = parseInt(process.env.PORT, 10);
    if (typeof envPort === 'number' && !isNaN(envPort) && envPort > 0) {
      options.port = envPort;
      return;
    }
  }
  if (!options.port) {
    options.port = DEFAULT_DEV_SERVER_PORT; // The default port.
  }
}

export default plugin;
