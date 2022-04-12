import type { RollupOptions, Plugin } from 'rollup';
import type { Context, IPluginAPI, IPlugin, ITaskConfig } from 'build-scripts';
import type { Config } from '@swc/core';

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

export type TaskName = 'pkg-cjs' | 'pkg-esm' | 'pkg-es2017';

export interface UserConfig {
  /**
   * Alias to file system paths
   * @default empty
   */
  alias?: PlainObject;
  /**
   * Define global constant replacements
   * @default empty
   */
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

  /**
   * Plugins of build scripts
   * @default @ice/pkg-plugin-component
   */
  plugins?: any;

  /**
   * "transform mode" means transform files one by one
   */
  transform?: {
    /**
     * Which type of contents would be generated
     * "cjs" - Commonjs with ES5 synatx (targeting Node version under 12);
     * "esm" - ES Module with ES5 synatx (lagacy outputs);
     * "es2017" - ES Module with ES2017 (targeting modern browsers and Node version upon 12)
     * @default ['esm','es2017']
     */
    formats?: Array<'cjs' | 'esm' | 'es2017'>;
    /**
     * Exclude all files matching any of those conditions.
     * - `string` to match any paths by `minimatch` glob patterns
     * - An `array` to match at least one of the conditions
     * @see https://github.com/isaacs/minimatch
     */
    excludes?: string | string[];
  };

  /**
   * "bundle mode" means bundle everything up by using of Rollup
   */
  bundle?: {
    /**
     * Export name
     * @default package.name
     */
    name?: string;
    /**
     * As the name of the generated file.
     * @default index
     */
    filename?: string;

    development?: boolean;
    /**
     * Which type of contents would be generated
     * "umd"
     * "esm"
     * "es2017"
     * @default ['esm','es2017']
     */
    formats?: Array<'umd' | 'esm' | 'es2017'>;
    /**
     * Specify external dependencies.
     * "boolean" - whether to bundle all dependencies or not;
     * "object" - specific external dependencies.
     * @default true nono of dependencies will be bundled by default
     */
    externals?: boolean | Object;
  };
}
