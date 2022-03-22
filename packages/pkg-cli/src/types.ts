import type { RollupOptions, Plugin } from 'rollup';
import type { Context, IPluginAPI, IPlugin, ITaskConfig } from 'build-scripts';
import type { Config, JsMinifyOptions, JscTarget, EnvConfig } from '@swc/core';

export type PlainObject = Record<string, string | boolean | number | object>;

export type RollupPluginFn<T> = (args: T) => Plugin;

export interface ComponentConfig {
  /**
   * There are two ways to handle source files
   * - 'transform' to transform files one by one to support tree shaking
   * - 'bundle' to bundle files into single file
   */
  type: 'bundle' | 'transform';
  /**
   * Entry for a specific task
   * @default `./src` for transforming task, and `./src/index[j|t]s` for bundling task
   */
  entry?: string;
  /**
   * Output directory
   */
  outputDir?: string;
  /**
   * Extra rollup plugins
   */
  rollupPlugins?: Plugin[];

  /**
   * Extra rollup options
   * @see https://rollupjs.org/guide/en/
   */
  rollupOptions?: RollupOptions;

  /**
   * Extra swc compile options
   * @see https://swc.rs/docs/configuration/compilationv
   */
  swcCompileOptions?: Config;
}

export type ComponentTaskConfig = ITaskConfig<ComponentConfig>;

export type ComponentContext = Context<ComponentConfig>;

export type ComponentPluginAPI = IPluginAPI<ComponentConfig, ExtendsPluginAPI>;

export type ComponentPlugin = IPlugin<ComponentConfig, ExtendsPluginAPI>;

export interface ExtendsPluginAPI {
  queryString: (name: string) => void;
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
   * @default @ice/pkg-plugin-compoent
   */
  plugins?: any;

  /**
   * Whether or not to compile code to commonjs format
   * @default false
   */
  lib?: boolean;

  /**
   * Include all files matching any of those conditions.
   * @see exclude
   */
  include?: string | string[];

  /**
   * Exclude all files matching any of those conditions.
   * - `string` to match any paths by `minimatch` glob patterns
   * - An `array` to match at least one of the conditions
   * @see https://github.com/isaacs/minimatch
   */
  exclude?: string | string[];

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
