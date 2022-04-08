import { doc } from './doc.mjs';
import { configureDocusaurus } from './configureDocusaurus.mjs';

import type { ComponentPlugin } from '@ice/pkg';

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
   * DevServer port for your doc.
   */
  port?: number;
}

const defaultOptions: PluginDocusaurusOptions = {
  title: '飞冰组件',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',
  navBarLogo: 'https://img.alicdn.com/imgextra/i1/O1CN01lZTSIX1j7xpjIQ3fJ_!!6000000004502-2-tps-160-160.png',
  navBarTitle: '飞冰组件',
  port: 4444,
};

// @ts-ignore
const plugin: ComponentPlugin = (api, options: PluginDocusaurusOptions) => {
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
