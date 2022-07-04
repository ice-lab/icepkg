import { doc } from './doc.mjs';
import { configureDocusaurus } from './configureDocusaurus.mjs';

import type { PkgPlugin } from '@ice/pkg';

const DEFAULT_DEV_SERVER_PORT = 4000;

export interface PluginDocusaurusOptions {
  /**
   * Title for your doc.
   */
  title?: string;
  /**
   * URL for your website. This can also be considered the top-level hostname.
   */
  url?: string;
  /**
   * Base URL for your site.
   */
  baseUrl?: string;
  /**
   * Path to your site favicon.
   */
  favicon?: string;
  /**
   * Path to your sidebar logo.
   */
  navBarLogo?: string;
  /**
   * Path to your sidebar title.
   */
  navBarTitle?: string;
  /**
   * DevServer port for your dev server.
   */
  port?: number;

  /**
   * Function used to replace the sidebar items.
   */
  sidebarItemsGenerator?: Function;
  /**
   * Whether preview components of mobile styles
   */
  mobilePreview?: boolean;
}

const defaultOptions: PluginDocusaurusOptions = {
  title: 'ICE PKG',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',
  navBarLogo: 'https://img.alicdn.com/imgextra/i1/O1CN01lZTSIX1j7xpjIQ3fJ_!!6000000004502-2-tps-160-160.png',
  navBarTitle: 'ICE PKG',
  port: undefined,
};

// @ts-ignore
const plugin: PkgPlugin = (api, options: PluginDocusaurusOptions) => {
  const { onHook, context } = api;
  const { command, rootDir } = context;

  const pluginOptions = {
    ...defaultOptions,
    ...options,
  };
  configureDevServerPort(pluginOptions);
  configureDocusaurus(rootDir, pluginOptions);

  onHook(`before.${command}.run`, () => {
    doc(api, pluginOptions);
  });
};

function configureDevServerPort(options) {
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
