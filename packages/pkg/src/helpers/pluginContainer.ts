import consola from 'consola';
import fs from 'fs-extra';
import { resolve, join, isAbsolute } from 'path';
import type {
  InputOptions,
  MinimalPluginContext,
  OutputOptions,
  ModuleInfo,
  NormalizedInputOptions,
  PartialResolvedId,
  ResolvedId,
  PluginContext as RollupPluginContext,
  LoadResult,
  SourceDescription,
  EmittedFile,
  SourceMap,
  RollupError,
  TransformResult,
  Plugin,
} from 'rollup';
import * as acorn from 'acorn';
import {
  combineSourcemaps,
  ensureWatchedFile,
  generateCodeFrame,
  isObject,
  isExternalUrl,
  normalizePath,
  numberToPos,
  timeFrom,
  createDebugger,
  safeRequire,
  require,
} from '../utils.js';
import MagicString from 'magic-string';
import type { FSWatcher } from 'chokidar';
import colors from 'picocolors';
import { performance } from 'perf_hooks';
import { SourceMapConsumer } from 'source-map';
import type * as postcss from 'postcss';
import { createLogger } from './logger.js';

export const FS_PREFIX = '/@fs/';

interface SourceMapV3 {
  file?: string | null;
  names: string[];
  sourceRoot?: string;
  sources: Array<string | null>;
  sourcesContent?: Array<string | null>;
  version: 3;
}

// copy from https://unpkg.com/browse/@ampproject/remapping@2.0.3/dist/types/types.d.ts
export interface RawSourceMap extends SourceMapV3 {
  mappings: string;
}

export interface PluginContainerOptions {
  cwd?: string;
  output?: OutputOptions;
  modules?: Map<string, { info: ModuleInfo }>;
  writeFile?: (name: string, source: string | Uint8Array) => void;
}

export interface PluginContainer {
  options: InputOptions;
  getModuleInfo: (id: string) => ModuleInfo | null;
  buildStart: (options: InputOptions) => Promise<void>;
  resolveId: (
    id: string,
    importer?: string,
    options?: {
      skip?: Set<Plugin>;
      ssr?: boolean;
    },
  ) => Promise<PartialResolvedId | null>;
  transform: (
    code: string,
    id: string,
    options?: {
      inMap?: SourceDescription['map'];
      ssr?: boolean;
    },
  ) => Promise<SourceDescription | null>;
  load: (
    id: string,
    options?: {
      ssr?: boolean;
    },
  ) => Promise<LoadResult | null>;
  close: () => Promise<void>;
}

type PluginContext = Omit<
  RollupPluginContext,
  // not documented
  | 'cache'
  // deprecated
  | 'emitAsset'
  | 'emitChunk'
  | 'getAssetFileName'
  | 'getChunkFileName'
  | 'isExternal'
  | 'moduleIds'
  | 'resolveId'
  | 'load'
>;

export let parser = acorn.Parser;

export async function createPluginContainer(
  { plugins, logger, root, output, build: { rollupOptions } },
  moduleGraph?: any,
  watcher?: FSWatcher,
): Promise<PluginContainer> {
  let ids = 0; // counter for generating unique emitted asset IDs
  const files = new Map();

  const isDebug = process.env.DEBUG;

  const seenResolves: Record<string, true | undefined> = {};

  const debugResolve = createLogger('resolve');
  const debugPluginResolve = createDebugger('plugin-resolve');
  const debugPluginTransform = createDebugger('plugin-transform');

  const watchFiles = new Set<string>();

  // get rollup version
  const rollupPkgPath = resolve(require.resolve('rollup'), '../../package.json');
  const minimalContext: MinimalPluginContext = {
    meta: {
      rollupVersion: safeRequire(rollupPkgPath).version,
      // rollupVersion: '2.3.4',
      watchMode: true,
    },
    debug: () => {},
    error: (e) => {
      throw e;
    },
    info: () => {},
    warn: () => {},
  };

  function warnIncompatibleMethod(method: string, plugin: string) {
    logger.warn(
      colors.cyan(`[plugin:${plugin}] `) +
        colors.yellow(
          `context method ${colors.bold(
            `${method}()`,
          )} is not supported in serve mode. This plugin is likely not vite-compatible.`,
        ),
    );
  }

  // throw when an unsupported ModuleInfo property is accessed,
  // so that incompatible plugins fail in a non-cryptic way.
  const ModuleInfoProxy: ProxyHandler<ModuleInfo> = {
    get(info: any, key: string) {
      if (key in info) {
        return info[key];
      }
      throw Error(`[vite] The "${key}" property of ModuleInfo is not supported.`);
    },
  };

  // same default value of "moduleInfo.meta" as in Rollup
  const EMPTY_OBJECT = Object.freeze({});

  function getModuleInfo(id: string) {
    const module = moduleGraph?.getModuleById(id);
    if (!module) {
      return null;
    }
    if (!module.info) {
      module.info = new Proxy({ id, meta: module.meta || EMPTY_OBJECT } as ModuleInfo, ModuleInfoProxy);
    }
    return module.info;
  }

  function updateModuleInfo(id: string, { meta }: { meta?: object | null }) {
    if (meta) {
      const moduleInfo = getModuleInfo(id);
      if (moduleInfo) {
        moduleInfo.meta = { ...moduleInfo.meta, ...meta };
      }
    }
  }

  // we should create a new context for each async hook pipeline so that the
  // active plugin in that pipeline can be tracked in a concurrency-safe manner.
  // using a class to make creating new contexts more efficient
  class Context implements PluginContext {
    meta = minimalContext.meta;
    ssr = false;
    _activePlugin: Plugin | null;
    _activeId: string | null = null;
    _activeCode: string | null = null;
    _resolveSkips?: Set<Plugin>;
    _addedImports: Set<string> | null = null;

    constructor(initialPlugin?: Plugin) {
      this._activePlugin = initialPlugin || null;
    }

    debug() {}

    info() {}

    parse(code: string, opts: any = {}) {
      return parser.parse(code, {
        sourceType: 'module',
        ecmaVersion: 'latest',
        locations: true,
        ...opts,
      }) as ReturnType<PluginContext['parse']>;
    }

    async resolve(id: string, importer?: string, options?: { skipSelf?: boolean }) {
      let skip: Set<Plugin> | undefined;
      if (options?.skipSelf && this._activePlugin) {
        skip = new Set(this._resolveSkips);
        skip.add(this._activePlugin);
      }
      let out = await container.resolveId(id, importer, { skip, ssr: this.ssr });
      if (typeof out === 'string') out = { id: out };
      return out as ResolvedId | null;
    }

    getModuleInfo(id: string) {
      return getModuleInfo(id);
    }

    getModuleIds() {
      return moduleGraph ? moduleGraph.idToModuleMap.keys() : Array.prototype[Symbol.iterator]();
    }

    addWatchFile(id: string) {
      watchFiles.add(id);
      (this._addedImports || (this._addedImports = new Set())).add(id);
      if (watcher) ensureWatchedFile(watcher, id, root);
    }

    getWatchFiles() {
      return [...watchFiles];
    }

    emitFile(assetOrFile: EmittedFile) {
      function resolveFileName(fileName: string) {
        if (!fileName) return;
        if (isAbsolute(fileName)) return fileName;
        return resolve(root, output, fileName);
      }

      // TODO: improve this
      const name =
        assetOrFile.type === 'chunk'
          ? assetOrFile.name || assetOrFile.id
          : assetOrFile.type === 'asset'
            ? assetOrFile.name
            : assetOrFile.fileName;
      const source = assetOrFile.type === 'asset' && assetOrFile.source;
      const filename = resolveFileName(assetOrFile.fileName);

      const id = String(++ids);
      files.set(id, { id, name, filename });

      if (assetOrFile.type === 'chunk') {
        consola.warn(
          `type ${assetOrFile.type} of this.emitFile is not supported in transform mode. This plugin is likely not compatible`,
        );
      } else if (source) {
        fs.writeFileSync(filename, source);
      }
      return id;
    }

    setAssetSource(assetId: string, source: string | Uint8Array) {
      const asset = files.get(String(assetId));
      if (asset.type === 'chunk') {
        return;
      }
      asset.source = source;
      fs.writeFile(asset.filename, source);
    }

    getFileName() {
      warnIncompatibleMethod('getFileName', this._activePlugin!.name);
      return '';
    }

    warn(e: string | RollupError, position?: number | { column: number; line: number }) {
      const err = formatError(e, position, this);
      const msg = err.message;
      // const msg = buildErrorMessage(
      //   err,
      //   [colors.yellow(`warning: ${err.message}`)],
      //   false,
      // );
      logger.warn(msg, {
        clear: true,
        timestamp: true,
      });
    }

    error(e: string | RollupError, position?: number | { column: number; line: number }): never {
      // error thrown here is caught by the transform middleware and passed on
      // the the error middleware.
      throw formatError(e, position, this);
    }
  }

  function formatError(
    e: string | RollupError,
    position: number | { column: number; line: number } | undefined,
    ctx: Context,
  ) {
    const err = (typeof e === 'string' ? new Error(e) : e) as postcss.CssSyntaxError & RollupError;

    if (err.file && err.name === 'CssSyntaxError') {
      err.id = normalizePath(err.file);
    }
    if (ctx._activePlugin) err.plugin = ctx._activePlugin.name;
    if (ctx._activeId && !err.id) err.id = ctx._activeId;

    if (ctx._activeCode && !err.pluginCode) {
      err.pluginCode = ctx._activeCode;

      const pos =
        position != null
          ? position
          : err.pos != null
            ? err.pos
            : // some rollup plugins, e.g. json, sets position instead of pos
              (err as any).position;

      if (pos != null) {
        let errLocation;
        try {
          errLocation = numberToPos(ctx._activeCode, pos);
        } catch (err2) {
          logger.error(
            colors.red(`Error in error handler:\n${err2.stack || err2.message}\n`),
            // print extra newline to separate the two errors
            { error: err2 },
          );
          throw err;
        }
        err.loc = err.loc || {
          file: err.id,
          ...errLocation,
        };
        err.frame = err.frame || generateCodeFrame(ctx._activeCode, pos);
      } else if (err.loc) {
        // css preprocessors may report errors in an included file
        if (!err.frame) {
          let code = ctx._activeCode;
          if (err.loc.file) {
            err.id = normalizePath(err.loc.file);
            try {
              code = fs.readFileSync(err.loc.file, 'utf-8');
            } catch {
              // empty
            }
          }
          err.frame = generateCodeFrame(code, err.loc);
        }
      } else if ((err as any).line && (err as any).column) {
        err.loc = {
          file: err.id,
          line: (err as any).line,
          column: (err as any).column,
        };
        err.frame = err.frame || generateCodeFrame(err.id!, err.loc);
      }

      if (err.loc && ctx instanceof TransformContext) {
        const rawSourceMap = ctx._getCombinedSourcemap();
        if (rawSourceMap) {
          const consumer = new SourceMapConsumer(rawSourceMap as any);
          const { source, line, column } = consumer.originalPositionFor({
            line: Number(err.loc.line),
            column: Number(err.loc.column),
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND,
          });
          if (source) {
            err.loc = { file: source, line, column };
          }
        }
      }
    }

    return err;
  }

  class TransformContext extends Context {
    filename: string;
    originalCode: string;
    originalSourcemap: SourceMap | null = null;
    sourcemapChain: Array<NonNullable<SourceDescription['map']>> = [];
    combinedMap: SourceMap | null = null;

    constructor(filename: string, code: string, inMap?: SourceMap | string) {
      super();
      this.filename = filename;
      this.originalCode = code;
      if (inMap) {
        this.sourcemapChain.push(inMap);
      }
    }

    _getCombinedSourcemap(createIfNull = false) {
      let { combinedMap } = this;
      for (let m of this.sourcemapChain) {
        if (typeof m === 'string') m = JSON.parse(m);
        if (!('version' in (m as SourceMap))) {
          // empty, nullified source map
          this.combinedMap = null;
          combinedMap = this.combinedMap;
          this.sourcemapChain.length = 0;
          break;
        }
        if (!combinedMap) {
          combinedMap = m as SourceMap;
        } else {
          combinedMap = combineSourcemaps(this.filename, [
            {
              ...(m as RawSourceMap),
              sourcesContent: combinedMap.sourcesContent,
            },
            combinedMap as RawSourceMap,
          ]) as SourceMap;
        }
      }
      if (!combinedMap) {
        return createIfNull
          ? new MagicString(this.originalCode).generateMap({
              includeContent: true,
              hires: true,
              source: this.filename,
            })
          : null;
      }
      if (combinedMap !== this.combinedMap) {
        this.combinedMap = combinedMap;
        this.sourcemapChain.length = 0;
      }
      return this.combinedMap;
    }

    getCombinedSourcemap() {
      return this._getCombinedSourcemap(true) as SourceMap;
    }
  }

  let closed = false;

  const container: PluginContainer = {
    options: await (async () => {
      let options = rollupOptions;
      for (const plugin of plugins) {
        if (!plugin.options) continue;
        options = (await plugin.options.call(minimalContext, options)) || options;
      }
      if (options.acornInjectPlugins) {
        parser = acorn.Parser.extend(options.acornInjectPlugins as any);
      }
      return {
        acorn,
        acornInjectPlugins: [],
        ...options,
      };
    })(),

    getModuleInfo,

    async buildStart() {
      await Promise.all(
        plugins.map((plugin) => {
          if (plugin.buildStart) {
            return plugin.buildStart.call(new Context(plugin) as any, container.options as NormalizedInputOptions);
          }
          return null;
        }),
      );
    },

    async resolveId(rawId, importer = join(root, 'index.html'), options) {
      const skip = options?.skip;
      const ssr = options?.ssr;
      const ctx = new Context();
      ctx.ssr = !!ssr;
      ctx._resolveSkips = skip;
      const resolveStart = isDebug ? performance.now() : 0;

      let id: string | null = null;
      const partial: Partial<PartialResolvedId> = {};
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue;
        if (skip?.has(plugin)) continue;

        ctx._activePlugin = plugin;

        const pluginResolveStart = isDebug ? performance.now() : 0;
        const result = await plugin.resolveId.call(ctx as any, rawId, importer, { ssr });
        if (!result) continue;

        if (typeof result === 'string') {
          id = result;
        } else {
          id = result.id;
          Object.assign(partial, result);
        }

        isDebug &&
          debugPluginResolve.info(
            timeFrom(pluginResolveStart),
            plugin.name,
            // prettifyUrl(id, root),
          );

        // resolveId() is hookFirst - first non-null result is returned.
        break;
      }

      if (isDebug && rawId !== id && !rawId.startsWith(FS_PREFIX)) {
        const key = rawId + id;
        // avoid spamming
        if (!seenResolves[key]) {
          seenResolves[key] = true;
          debugResolve.info(`${timeFrom(resolveStart)}`, `${colors.cyan(rawId)} -> ${colors.dim(id)}`);
        }
      }

      if (id) {
        partial.id = isExternalUrl(id) ? id : normalizePath(id);
        return partial as PartialResolvedId;
      } else {
        return null;
      }
    },

    async load(id, options) {
      const ssr = options?.ssr;
      const ctx = new Context();
      ctx.ssr = !!ssr;
      for (const plugin of plugins) {
        if (!plugin.load) continue;
        ctx._activePlugin = plugin;

        const result = await plugin.load.call(ctx as any, id, { ssr });
        if (result != null) {
          if (isObject(result)) {
            updateModuleInfo(id, result);
          }
          return result;
        }
      }
      return null;
    },

    async transform(code, id, options) {
      const inMap = options?.inMap;
      const ssr = options?.ssr;
      const ctx = new TransformContext(id, code, inMap as SourceMap);
      ctx.ssr = !!ssr;
      let meta = null;
      for (const plugin of plugins) {
        if (!plugin.transform) continue;
        ctx._activePlugin = plugin;
        ctx._activeId = id;
        ctx._activeCode = code;
        const start = isDebug ? performance.now() : 0;
        let result: TransformResult | string | undefined;
        try {
          result = await plugin.transform.call(ctx as any, code, id, { ssr });
        } catch (e) {
          ctx.error(e);
        }
        if (!result) continue;
        isDebug &&
          debugPluginTransform(
            timeFrom(start),
            plugin.name,
            // prettifyUrl(id, root),
          );
        if (isObject(result)) {
          if (result.code !== undefined) {
            code = result.code;
            if (result.map) {
              ctx.sourcemapChain.push(result.map);
            }

            // Add to support custom meta info
            if (result.meta) {
              meta = result.meta;
            }
          }
          updateModuleInfo(id, result);
        } else {
          code = result;
        }
      }
      return {
        code,
        map: ctx._getCombinedSourcemap(),
        meta,
      };
    },

    async close() {
      if (closed) return;
      const ctx = new Context();
      await Promise.all(plugins.map((p) => p.buildEnd && p.buildEnd.call(ctx as any)));
      await Promise.all(plugins.map((p) => p.closeBundle && p.closeBundle.call(ctx as any)));
      closed = true;
    },
  };

  return container;
}
