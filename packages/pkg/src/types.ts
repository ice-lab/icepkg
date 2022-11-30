import type { RollupOptions, Plugin, SourceMapInput, ModuleJSON } from 'rollup';
import type { Context, IPluginAPI, IPlugin, ITaskConfig } from 'build-scripts';
import type { Config } from '@swc/core';
import { PostCSSPluginConf } from 'rollup-plugin-postcss';

export type PlainObject = Record<string, string | boolean | number | object>;
export type ReverseMap<T> = T[keyof T];

export type RollupPluginFn<T = {}> = (args?: T) => Plugin;

interface BundleOptions {
  /**
   * Export name
   * @default package.name
   */
  name?: string;
  /**
   * As the name of the generated file.
   * @default index
   */
  filename?: |
  string |
  ((options: { isES2017: boolean; format: Omit<TaskConfig['bundle']['formats'][number], 'es2017'>; taskConfig: TaskConfig; development?: boolean }) => string);

  development?: boolean;
  /**
   * Which type of contents would be generated
   * "umd"
   * "esm"
   * "es2017"
   * @default ['esm','es2017']
   */
  formats: Array<'umd' | 'esm' | 'cjs' | 'es2017'>;
  /**
   * Specify external dependencies.
   * "boolean" - whether to bundle all dependencies or not;
   * "object" - specific external dependencies.
   * @default true All of dependencies will be bundled by default.
   */
  externals?: boolean | Record<string, string>;

  /**
   * Minify JS and CSS bundle.
   */
  minify?: boolean;
}
export interface TaskLoaderConfig extends TaskConfig {
  name: TaskName;
}

export interface TaskConfig {
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
  entry?: RollupOptions['input'];
  /**
  * Output directory
  */
  outputDir?: string;
  /**
  * Extra rollup plugins
  */
  rollupPlugins?: Plugin[];

  /**
   * Extra babel plugins
   */
  babelPlugins?: babel.PluginItem[];
  /**
  * Extra rollup options
  * @see https://rollupjs.org/guide/en/
  */
  rollupOptions?: RollupOptions;
  /**
   * Config postcss options.
   */
  postcssOptions?: (options: PostCSSPluginConf) => PostCSSPluginConf;
  /**
  * Extra swc compile options
  * @see https://swc.rs/docs/configuration/compilationv
  */
  swcCompileOptions?: Config;

  /**
   * Files extensions
   * @see https://www.npmjs.com/package/@rollup/plugin-node-resolve
   */
  extensions?: string[];

  /**
   *  Alias to file system paths
   */
  alias?: Record<string, string>;

  /**
   * Define global constant replacements
   */
  define?: Record<string, string>;

  /**
    * - true to generate a sourcemap for the code and include it in the result object.
    * - "inline" to generate a sourcemap and append it as a data URL to the end of the code,
    * but not include it in the result object.
    */
  sourcemap?: boolean | 'inline';

  /**
   * "bundle mode" means bundle everything up by using Rollup
   */
  bundle?: BundleOptions;
}

export type PkgTaskConfig = ITaskConfig<TaskConfig, TaskName>;

export type PkgContext = Context<TaskConfig, {}, UserConfig>;

export type PkgPluginAPI = IPluginAPI<TaskConfig>;

export type PkgPlugin = IPlugin<TaskConfig>;

export enum TaskName {
  'TRANSFORM_CJS' = 'transform-cjs',
  'TRANSFORM_ESM' = 'transform-esm',
  'TRANSFORM_ES2017' = 'transform-es2017',
  'BUNDLE_ES5' = 'bundle-es5',
  'BUNDLE_ES2017' = 'bundle-es2017',
}

export interface OutputFile {
  // globby parsed path, which is relative
  filePath?: string;
  // Absolute path of source file
  absolutePath?: string;
  // ext: 'jsx' | 'js' | 'ts' | 'tsx' | 'mjs' | 'png' | 'scss' | 'less' | 'css' | 'png' | 'jpg';
  ext?: string;
  // Absolute path of output files
  dest?: string;
  // Filename of output file
  filename?: string;
  // Parsed code
  code?: string | Uint8Array;
  // Source map
  map?: string | SourceMapInput;
}

export interface OutputResult {
  taskName: string;
  outputFiles: OutputFile[];
  // Only exist in rollup bundle task
  modules?: ModuleJSON[];
}

export interface UserConfig {
  /**
   * Alias to file system paths
   * @default {}
   */
  alias?: Record<string, string>;
  /**
   * Define global constant replacements
   */
  define?: Record<string, string>;
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
   * @default ['@ice/pkg-plugin-component']
   */
  plugins?: Array<string | [string, any?]>;

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
   * "bundle mode" means bundle everything up by using Rollup
   */
  bundle?: BundleOptions;
}
