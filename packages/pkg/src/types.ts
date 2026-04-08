import * as swc from '@swc/core';
import type { RollupOptions, SourceMapInput, ModuleJSON, RollupOutput } from 'rollup';
import type {
  Context as _Context,
  PluginAPI as _PluginAPI,
  Plugin as _Plugin,
  TaskConfig as _BuildTask,
  PluginInfo as _PluginInfo,
  Json,
} from 'build-scripts';
import type { Config } from '@swc/core';
import type stylesPlugin from 'rollup-plugin-styler';
import type { FSWatcher } from 'chokidar';
import cssnano from 'cssnano';
import { TransformOptions } from '@babel/core';
import { ALL_FORMAT_MODULES, ALL_FORMAT_TARGET, BUNDLE_FORMAT_MODULE, NODE_FORMAT_MODULE } from './constants.js';
import { RslibConfig } from '@rslib/core';
import type { SecureServerSessionOptions } from 'node:http2';
import { ServerOptions as HttpsServerOptions } from 'node:https';
import { CorsOptions } from 'cors';
import type { Options as HttpProxyMiddlewareOptions } from 'http-proxy-middleware';

export type StylesRollupPluginOptions = Parameters<typeof stylesPlugin>[0];

export type PlainObject = Record<string, string | boolean | number | object | null>;

type JSMinify =
  | boolean
  | {
      options?: swc.JsMinifyOptions;
    };

type CSSMinify =
  | boolean
  | {
      options?: Parameters<typeof cssnano>[0];
    };

export type NodeModuleType = (typeof NODE_FORMAT_MODULE)[number];
export type BundleModuleType = (typeof BUNDLE_FORMAT_MODULE)[number];
export type ModuleType = (typeof ALL_FORMAT_MODULES)[number];

export type JsTarget = (typeof ALL_FORMAT_TARGET)[number];

export type StandardTransformFormatString = `${NodeModuleType}:${JsTarget}`;
export type StandardBundleFormatString = `${ModuleType}:${JsTarget}`;
export type StandardFormatString = StandardTransformFormatString | StandardBundleFormatString;

export interface Format<M extends ModuleType = ModuleType, T extends JsTarget = JsTarget> {
  module: M;
  target: T;
}

export type TransformFormat = Format<NodeModuleType, JsTarget>;
export type BundleFormat = Format<ModuleType, JsTarget>;

export type AliasTransformFormatString = 'cjs' | 'esm' | 'es2017';
export type AliasBundleFormatString = AliasTransformFormatString | 'umd' | 'mf';

export type TransformUserFormat = StandardTransformFormatString | AliasTransformFormatString;
export type BundleUserFormat = StandardBundleFormatString | AliasBundleFormatString;

export interface TransformUserConfig {
  /**
   * Which type of contents would be generated
   * "cjs" - Commonjs with ES5 syntax (targeting Node version under 12);
   * "esm" - ES Module with ES5 syntax (legacy outputs);
   * "es2017" - ES Module with ES2017 (targeting modern browsers and Node version upon 12)
   * @default ['esm', 'es2017']
   */
  formats?: TransformUserFormat[];
  /**
   * Exclude all files matching any of those conditions.
   * - `string` to match any paths by `minimatch` glob patterns
   * - An `array` to match at least one of the conditions
   * Default: files in __tests__ directories are excluded by default.
   * @see https://github.com/isaacs/minimatch
   */
  excludes?: string | string[];

  /**
   * Root directory used to map transform output paths.
   * This only affects output path layout, not file include scope.
   */
  entryRoot?: string;
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
  formats?: BundleUserFormat[];
  /**
   * Specify external dependencies.
   * "boolean" - whether to bundle all dependencies or not;
   * "object" - specific external dependencies.
   * "array" - specific external match logic
   * "false" - all the dependencies will be bundled by default.
   * @default false
   */
  externals?: boolean | Record<string, string> | Array<string | RegExp | Record<string, string>>;

  /**
   * Minify JS and CSS bundle.
   */
  minify?:
    | boolean
    | {
        js?: boolean | ((mode: string, command: string) => JSMinify);
        css?: boolean | ((mode: string, command: string) => CSSMinify);
      };

  /**
   * Weather or not add the polyfill(core-js) to the code.
   * `undefined` is equivalent to `false`
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

  /**
   * Define which bundler engine to use
   * @experimental
   */
  engine?: EngineType;

  /**
   * Wether or not to code splitting into different chunks
   * @since 2.0.0
   * @default true
   */
  codeSplitting?: boolean;
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

export interface PkgUserConfig
  extends Pick<
      BundleUserConfig,
      'externals' | 'name' | 'compileDependencies' | 'polyfill' | 'engine' | 'minify' | 'codeSplitting'
    >,
    Pick<UserConfig, 'alias' | 'define' | 'jsxRuntime' | 'declaration' | 'entry' | 'sourceMaps' | 'helpers'> {
  /**
   * Unique id to indicate a package
   */
  id?: string;

  /**
   * JS target
   * @default 'es5'
   */
  target?: JsTarget;

  /**
   * Module type
   * @default 'esm'
   */
  module?: ModuleType;

  /**
   * Is bundle or bundless
   * @default false
   */
  bundle?: boolean;

  /**
   * Extends other packages, use preset package or other package id
   */
  extends?: Array<PresetPkg | string>;

  /**
   * Plugins only for this package
   */
  plugins?: UserConfig['plugins'];

  /**
   * Define output directory
   */
  outputDir?: string;

  /**
   * Root directory used to map transform output paths for this pkg.
   * Has higher priority than `transform.entryRoot`.
   */
  entryRoot?: string;

  /**
   * Disable this pkg to build
   */
  disable?: boolean;
}

type PkgResolvedRequiredConfigKeys = 'module' | 'target' | 'id';

export type PluginInfo<T = unknown, U = unknown, K = unknown> = _PluginInfo<T, U, K>;

export interface PkgResolvedConfig
  extends Omit<PkgUserConfig, 'extends' | 'preset' | 'plugins' | PkgResolvedRequiredConfigKeys>,
    Required<Pick<PkgUserConfig, PkgResolvedRequiredConfigKeys>> {
  pluginInfos: PluginInfo[];
  /**
   * for compat old task config, used for build task name
   */
  displayId?: string;

  /**
   * for compat old task config, used for multi module output.
   * When extraModules is preset, `module` is ignored
   */
  legacyModules?: ModuleType[];
}

export type PresetPkg = TransformUserFormat | `!${BundleUserFormat}`;

export interface UserConfig {
  pkgs?: Array<PresetPkg | PkgUserConfig | boolean | undefined>;
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

  /**
   * Server config
   * @default false
   */
  server?: boolean | ServerUserConfig;

  /**
   * Configure how SWC helper functions are handled globally.
   * - 'external': Import from @swc/helpers package (default, smaller output size)
   * - 'inline': Inline helpers into each file (no external dependency needed)
   * @default 'external'
   */
  helpers?: 'external' | 'inline';
}

export type PluginUserConfig = string | [string, Json?] | Plugin;

export type TaskOrder = 'pre' | 'builtin' | 'normal' | 'post';

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
   * Define which bundler engine to use.
   * - 'rollup'
   * - 'rslib' common used for mf build
   * - 'rolldown' experimental
   * @default 'rollup'
   */
  engine?: EngineType;
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
  /**
   * modify rslib config
   */
  modifyRslibConfig?: Array<(rslibOptions: RslibConfig) => RslibConfig>;

  /**
   * Control task execution order globally across all task types.
   * - 'pre' runs before normal tasks
   * - 'builtin' runs between pre and normal
   * - 'normal' keeps default order
   * - 'post' runs after normal tasks
   * @default 'normal'
   */
  order?: TaskOrder;

  /**
   * Configure how SWC helper functions are handled for this task.
   * Resolved from userConfig.helpers or pkg.helpers.
   * - 'external': Import from @swc/helpers package (default)
   * - 'inline': Inline helpers into each file
   */
  helpers?: 'external' | 'inline';

  pkg?: PkgResolvedConfig;
}

export type EngineType = 'rollup' | 'rslib' | 'rolldown';

export interface BundleTaskConfig extends _TaskConfig, Omit<BundleUserConfig, 'minify' | 'formats'> {
  type: 'bundle';
  originalFormats?: string[];
  // For normal usage(pkg mode), formats is always has one element
  // For legacy usage, formats maybe has multiple elements which has same target
  formats: BundleFormat[];
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
  codeSplitting?: boolean;
}

export interface TransformTaskConfig extends _TaskConfig, Omit<TransformUserConfig, 'formats'> {
  type: 'transform';
  originalFormat?: string;
  format: TransformFormat;
  /**
   * Node env modes. For example: 'production', 'development'
   * @default `['development']` on start, `['production']` on build.
   */
  modes?: NodeEnvMode[];
  /**
   * Same as https://swc.rs/docs/configuration/compilation#jsctransformoptimizerglobals
   */
  define?: Record<string, string>;

  /**
   * Absolute root directory used to map output paths in transform mode.
   */
  entryRoot?: string;
}

export interface DeclarationTaskConfig extends _TaskConfig, DeclarationUserConfig {
  type: 'declaration';
  /**
   * 实际的输出目录，可以同时输出到 esm、es2017 内等
   * @internal
   */
  declarationOutputDirs?: string[];
}

export type TaskConfig = BundleTaskConfig | TransformTaskConfig | DeclarationTaskConfig;

export type BuildTask = _BuildTask<TaskConfig, TaskName | string>;

export type Context = _Context<TaskConfig, ExtendsPluginAPI, UserConfig>;

// Plugins
export interface ExtendsPluginAPI {
  pluginScope?: 'global' | 'pkg';
}

export type PluginAPI = _PluginAPI<TaskConfig, ExtendsPluginAPI>;

/**
 * @deprecated Please use PluginAPI instead.
 */
export type PkgPluginAPI = PluginAPI;

export type Plugin = _Plugin<TaskConfig, ExtendsPluginAPI>;

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
  'DECLARATION' = 'declaration',
}
type TaskKey = keyof typeof TaskName;
// TODO: The type name should be renamed to TaskName.
export type TaskValue = (typeof TaskName)[TaskKey];

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

export type TransformOutputFile = Required<Pick<OutputFile, 'absolutePath' | 'ext' | 'filePath'>>;

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

export interface TaskRunnerContext {
  mode: NodeEnvMode;
  buildTask: BuildTask;
  buildContext: Context;
  watcher?: FSWatcher;
}

export interface PackageJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: string | Record<string, string> | undefined;
}

export interface ServerPublicDirOptions {
  /**
   * The name of the public directory, can be set as a relative path or an absolute path.
   */
  name?: string;
}

export type ServerPublicDirOptionsWithString = ServerPublicDirOptions | string;

export type ServerPublicDir = ServerPublicDirOptionsWithString | ServerPublicDirOptionsWithString[];

export type ServerProxyConfig = Record<string, string | HttpProxyMiddlewareOptions> | HttpProxyMiddlewareOptions[];

export interface ServerUserConfig {
  /**
   * Serving static files from the directory
   * @default { name: 'public', copyOnBuild: 'auto', watch: false }
   */
  publicDir?: ServerPublicDir;
  /**
   * Specify a port number for server to listen.
   * @default 5138
   * - 5 => nothing, just a prefix
   * - 1 => i
   * - 3 => c => three
   * - 8 => e => eight
   */
  port?: number;
  /**
   * Configure HTTPS options to enable HTTPS server.
   * When enabled, HTTP server will be disabled.
   */
  https?: HttpsServerOptions | SecureServerSessionOptions;
  /**
   * Specify the host that the server listens to.
   * @default '0.0.0.0'
   */
  host?: string;
  /**
   * Adds headers to all responses.
   */
  headers?: Record<string, string | string[]>;
  /**
   * Configure CORS for the dev server or preview server.
   * - object: enable CORS with the specified options.
   * - true: enable CORS with default options (allow all origins, not recommended).
   * - false: disable CORS.
   * @link https://github.com/expressjs/cors
   */
  cors?: boolean | CorsOptions;
  /**
   * Configure proxy rules for the dev server or preview server to proxy requests to
   * the specified service.
   */
  proxy?: ServerProxyConfig;
  /**
   * Whether to enable serve bundled files in the server
   * @default true
   */
  autoServeBundle?: boolean;
}
