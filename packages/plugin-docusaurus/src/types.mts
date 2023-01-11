export interface EnableConfig {
  start?: boolean;
  build?: boolean;
}

export interface PluginDocusaurusOptions {
  /**
   * Enable doc build
   */
  enable?: boolean | EnableConfig;
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

  /**
   * Default locale that does not have its name in the base URL
   */
  defaultLocale?: string;

  /**
   * List of locales deployed on your site. Must contain defaultLocale.
   */
  locales?: string[];
  /**
   * Docusaurus output dir.
   */
  outputDir?: string;
}
