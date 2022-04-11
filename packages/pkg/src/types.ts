import type { RollupOptions, Plugin } from 'rollup';
import type { Context, IPluginAPI, IPlugin, ITaskConfig } from 'build-scripts';
import type { Config, JsMinifyOptions, JscTarget, EnvConfig } from '@swc/core';

interface Json<T> {
  [str: string]: T;
}

export type PlainObject = Record<string, string | boolean | number | object>;

export type RollupPluginFn<T> = (args: T) => Plugin;

export interface ComponentConfig {
  type: 'bundle' | 'transform';
  /**
   * TODO: explainations
   */
  entry?: string;
  outputDir?: string;
  rollupPlugins?: Plugin[];

  rollupOptions?: RollupOptions;
  swcCompileOptions?: Config;
}

export type ComponentTaskConfig = ITaskConfig<ComponentConfig>;

export type ComponentContext = Context<ComponentConfig>;

export type ComponentPluginAPI = IPluginAPI<ComponentConfig, ExtendsPluginAPI>;

export type ComponentPlugin = IPlugin<ComponentConfig, ExtendsPluginAPI>;

export interface ExtendsPluginAPI {
  queryString: (name: string) => void;
}


export interface Declation {
  js?: boolean;
}

export interface UserConfig {
  /**
   * minize output
   * @default false
   */
  minify?: boolean | JsMinifyOptions;

  alias?: PlainObject;

  define?: PlainObject;
  /**
  * - true to generate a sourcemap for the code and include it in the result object.
  * - "inline" to generate a sourcemap and append it as a data URL to the end of the code,
  * but not include it in the result object.
   */
  sourceMaps?: boolean | 'inline';
  /**
  * Whether or not to generate declation files for Ecmascript
  * @default false
  */
  generateTypesForJs?: boolean;

  babelPlugins?: any;

  /**
   * Plugins of build scripts
   * @default @ice/pkg-plugin-component
   */
  plugins?: any;

  /**
   * Whether or not to compile code to commonjs format
   * @default false
   */
  lib?: boolean;

  umd?: {
    /**
     * Export name
     * @default package.name
     */
    name?: string;

    sourceMaps?: boolean | 'inline';

    minify?: boolean | JsMinifyOptions;

    /**
     * As the name of the generated file.
     * @default index.js
     */
    filename?: string;

    /**
     * Configure polyfills & env all in once
     */
    env?: JscTarget | EnvConfig;

    /**
     * Tree shaking unnecessary code by platform
     * @default false
     */
    enablePlatformLoader?: boolean;
  };
}
