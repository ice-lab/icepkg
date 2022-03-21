import { doc } from './doc.mjs';
import { configureDocusaurus } from './configureDocusaurus.mjs';

import type { ComponentPlugin } from '@ice/pkg-cli';

export interface PluginDocusarusOptions {
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
   * DevServer port for your doc.
   */
  port?: number;
}

const defaultOptions: PluginDocusarusOptions = {
  title: '飞冰组件',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  navBarLogo: 'img/logo.png',
  navBarTitle: '飞冰组件',
  port: 4444,
};

// @ts-ignore
const plugin: ComponentPlugin = (api, options: PluginDocusarusOptions) => {
  const {
    onHook,
    context,
  } = api;

  const { command, rootDir } = context;

  const pluginOptions = {
    ...defaultOptions,
    ...options,
  };
  configureDocusaurus(rootDir, pluginOptions);

  onHook(`before.${command}.run`, () => {
    doc(api, pluginOptions);
  });
};

export default plugin;
