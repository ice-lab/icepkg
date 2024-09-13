import * as swc from '@swc/core';

import type { RollupOptions, SourceMapInput, ModuleJSON, RollupOutput } from 'rollup';
import type { Context as _Context, PluginAPI as _PluginAPI, Plugin as _Plugin, TaskConfig as _BuildTask } from 'build-scripts';
import type { Config } from '@swc/core';
import type stylesPlugin from 'rollup-plugin-styler';
import type { FSWatcher } from 'chokidar';
import cssnano from 'cssnano';
import { TransformOptions } from '@babel/core';

export type StylesRollupPluginOptions = Parameters<typeof stylesPlugin>[0];

export type PlainObject = Record<string, string | boolean | number | object | null>;

type JSMinify = boolean | {
  options?: swc.JsMinifyOptions;
};

type CSSMinify = boolean | {
  options?: Parameters<typeof cssnano>[0];
};

export interface TransformUserConfig {
  /**
   * Which type of contents would be generated
   * "cjs" - Commonjs with ES5 syntax (targeting Node version under 12);
   * "esm" - ES Module with ES5 syntax (legacy outputs);
   * "es2017" - ES Module with ES2017 (targeting modern browsers and Node version upon 12)
   * @default ['esm', 'es2017']
   */
  formats?: Array<'cjs' | 'esm' | 'es2017'>;
  /**
   * Exclude all files matching any of those conditions.
   * - `string` to match any paths by `minimatch` glob patterns
   * - An `array` to match at least one of the conditions
   * @see https://github.com/isaacs/minimatch
   */
  excludes?: string | string[];
}

export interface BundleUserConfig {
  /**
   * Export name
   * @default package.name
   */
  name?: string;
  /**
   * Output directory
   * @default 'dist'
   */
  outputDir?: string;
  /**
   * @deprecated Please use `bundle.modes` config.
   * Generate uncompressed bundle for development debug.
   */
  development?: boolean;
  /**
   * Node env modes. For example: 'production', 'development'
   * @default ['production']
   */
  modes?: NodeEnvMode[];
  /**
   * Which type of contents would be generated
   * "umd"
   * "esm"
   * "cjs"
   * "es2017"
   * @default ['esm','es2017']
   */
  formats?: Array<'umd' | 'esm' | 'cjs' | 'es2017'>;
  /**
   * Specify external dependencies.
   * "boolean" - whether to bundle all dependencies or not;
   * "object" - specific external dependencies.
   * @default false All of dependencies will be bundled by default.
   */
  externals?: boolean | Record<string, string>;

  /**
   * Minify JS and CSS bundle.
   */
  minify?: boolean | {
    js?: boolean | ((mode: string, command: string) => JSMinify);
    css?: boolean | ((mode: string, command: string) => CSSMinify);
  };

  /**
   * Weather or not add the polyfill to the code.
   * @default ['usage']
   *
   * In the next version(v2), the value of polyfill will be `false`.
   */
  polyfill?: false | 'entry' | 'usage';

  /**
   * Weather or not compile the dependencies in node_modules.
   */
  compileDependencies?: boolean | Array<RegExp | string>;

  /**
   * Resolve node module by prefer using `browser` field in package.json.
   */
  browser?: boolean;
}


export interface DeclarationUserConfig {
  /**
   * How to output declaration files.
   * - 'multi' output .d.ts to every transform format folder, like esm/es2017
   * - 'unique' output .d.ts to `typings` folder of the root
   * @default 'multi'
   */
  outputMode?: 'multi' | 'unique';

  /**
   * The generator to generate .d.ts file
   * - `'tsc'` use typescript
   * - `'oxc'` use oxc-transform to generate isolated declaration
   * @default 'tsc'
   */
  generator?: 'tsc' | 'oxc';
}

export interface UserConfig {
  /**
   * Entry for a task
   * @default  `./src/index`
   */
  entry?: RollupOptions['input'];
  /**
   * Alias to file system paths
   * @default {}
   */
  alias?: Record<string, string>;
  /**
   * Define global constant replacements
   */
  define?: PlainObject;
  /**
   * - true to generate a sourcemap for the code and include it in the result object.
   * - "inline" to generate a sourcemap and append it as a data URL to the end of the code,
   * but not include it in the result object.
   */
  sourceMaps?: boolean | 'inline';
  /**
   * Whether or not to generate declaration files for Ecmascript
   * @default false
   */
  generateTypesForJs?: boolean;

  /**
   * Generate .d.ts files from TypeScript files in your project.
   * @default true
   */
  declaration?: boolean | DeclarationUserConfig;

  /**
   * Configure JSX transform type.
   * @default 'automatic'
   */
  jsxRuntime?: 'automatic' | 'classic';
  /**
   * Plugins of build scripts
   * @default []
   */
  plugins?: PluginUserConfig[];

  /**
   * "transform mode" means transform files one by one
   */
  transform?: TransformUserConfig;

  /**
   * "bundle mode" means bundle everything up by using Rollup
   */
  bundle?: BundleUserConfig;
}

export type PluginUserConfig = string | [string, any?] | Plugin;

interface _TaskConfig {
  /**
  * Entry for a task
  * @default  `./src/index`
  */
  entry?: RollupOptions['input'];
  /**
  * Output directory
  */
  outputDir?: string;
  /**
   * Define global constant replacements
   */
  define?: PlainObject;
  /**
    * - true to generate a sourcemap for the code and include it in the result object.
    * - "inline" to generate a sourcemap and append it as a data URL to the end of the code,
    * but not include it in the result object.
    */
  sourcemap?: boolean | 'inline';
  /**
   *  Alias to file system paths
   */
  alias?: Record<string, string>;
  /**
   * JSX transform type.
   */
  jsxRuntime?: 'automatic' | 'classic';
  /**
   * Modify default rollup options
   * @see https://rollupjs.org/guide/en/#rolluprollup
   */
  modifyRollupOptions?: Array<(rollupOptions: RollupOptions) => RollupOptions>;
  /**
  * Configure extra swc compile options.
  * @see https://swc.rs/docs/configuration/compilation
  */
  swcCompileOptions?: Config;
  /**
   * Modify inner swc compile options.
   * @see https://swc.rs/docs/configuration/compilation
   */
  modifySwcCompileOptions?: (swcCompileOptions: Config) => Config;
  /**
   * Extra babel plugins
   */
  babelPlugins?: babel.PluginItem[];
  /**
   * Modify default babel options
   * @see https://babeljs.io/docs/options
   */
  modifyBabelOptions?: (babelCompileOptions: TransformOptions) => TransformOptions;
}

export interface BundleTaskConfig extends
  _TaskConfig,
  Omit<BundleUserConfig, 'development' | 'minify'> {
  type: 'bundle';
  /**
  * Files extensions
  * @see https://www.npmjs.com/package/@rollup/plugin-node-resolve
  */
  extensions?: string[];
  /**
   * Config styles options. See https://www.npmjs.com/package/rollup-plugin-styles
   */
  modifyStylesOptions?: Array<(options: StylesRollupPluginOptions) => StylesRollupPluginOptions>;

  jsMinify?: (mode: string, command: string) => JSMinify;

  cssMinify?: (mode: string, command: string) => CSSMinify;

  vendorName?: string;
}

export interface TransformTaskConfig extends _TaskConfig, TransformUserConfig {
  type: 'transform';
  /**
   * Node env modes. For example: 'production', 'development'
   * @default `['development']` on start, `['production']` on build.
   */
  modes?: NodeEnvMode[];
  /**
   * Same as https://swc.rs/docs/configuration/compilation#jsctransformoptimizerglobals
   */
  define?: Record<string, string>;
}

export interface DeclarationTaskConfig extends _TaskConfig, DeclarationUserConfig {
  type: 'declaration';
  /**
   * 记录 transform 配置的 format 用于计算实际的输出目录
   */
  transformFormats?: TransformUserConfig['formats'];
  /**
   * 实际的输出目录，可以同时输出到 esm、es2017 内等
   */
  declarationOutputDirs?: string[];
}

export type TaskConfig = BundleTaskConfig | TransformTaskConfig | DeclarationTaskConfig;

export type BuildTask = _BuildTask<TaskConfig, TaskName>;

export type Context = _Context<TaskConfig, {}, UserConfig>;

export type PluginAPI = _PluginAPI<TaskConfig>;
/**
 * @deprecated Please use PluginAPI instead.
 */
export type PkgPluginAPI = PluginAPI;

export type Plugin = _Plugin<TaskConfig>;
/**
 * @deprecated Please use Plugin instead.
 */
export type PkgPlugin = Plugin;

// TODO: The enum name should be renamed to Task.
export enum TaskName {
  'TRANSFORM_CJS' = 'transform-cjs',
  'TRANSFORM_ESM' = 'transform-esm',
  'TRANSFORM_ES2017' = 'transform-es2017',
  'BUNDLE_ES5' = 'bundle-es5',
  'BUNDLE_ES2017' = 'bundle-es2017',
  'DECLARATION' = 'declaration'
}
type TaskKey = keyof typeof TaskName;
// TODO: The type name should be renamed to TaskName.
export type TaskValue = typeof TaskName[TaskKey];

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
  outputs?: Array<RollupOutput['output']>;
}

// Set for `process.env.NODE_ENV`
export type NodeEnvMode = 'development' | 'production' | string;

export type WatchEvent = 'create' | 'update' | 'delete';

export interface WatchChangedFile {
  path: string;
  event: WatchEvent;
}

export type HandleChange<R = OutputResult> = (changedFiles: WatchChangedFile[]) => Promise<R>;

export interface TaskResult {
  handleChange?: HandleChange<OutputResult[]>;
  outputResults: OutputResult[];
}
export interface TaskRunnerContext {
  mode: NodeEnvMode;
  buildTask: BuildTask;
  buildContext: Context;
  watcher?: FSWatcher;
}

export type RunTasks = (
  taskOptionsList: Array<[RollupOptions, TaskRunnerContext]>,
  context: Context,
  watcher?: FSWatcher,
) => Promise<TaskResult>;
