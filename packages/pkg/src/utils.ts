import { performance } from 'perf_hooks';
import fs from 'fs-extra';
import picocolors from 'picocolors';
import path from 'path';
import os from 'os';
import debug from 'debug';
import { createRequire } from 'module';
import { createFilter } from '@rollup/pluginutils';
import remapping from '@ampproject/remapping';
import { loadPkg } from './helpers/load.js';
import consola from 'consola';

import type { PlainObject, OutputResult, TaskConfig } from './types';
import type {
  DecodedSourceMap,
  RawSourceMap,
} from '@ampproject/remapping';
import type { FSWatcher } from 'chokidar';

export function toArray<T>(any: T | T[]): T[] {
  return Array.isArray(any) ? any : [any];
}

export function slash(p: string): string {
  return p.replace(/\\/g, '/');
}

export const externalRE = /^(https?:)?\/\//;
export const isExternalUrl = (url: string): boolean => externalRE.test(url);

export const isWindows = os.platform() === 'win32';

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

export function ensureWatchedFile(
  watcher: FSWatcher,
  file: string | null,
  root: string,
): void {
  if (
    file &&
    // only need to watch if out of root
    !file.startsWith(`${root}/`) &&
    // some rollup plugins use null bytes for private resolved Ids
    !file.includes('\0') &&
    fs.existsSync(file)
  ) {
    // resolve file to normalized system path
    watcher.add(path.resolve(file));
  }
}

export function createDebugger(
  namespace: string,
): debug.Debugger['log'] {
  const log = debug(namespace);
  return (msg: string, ...args: any[]) => {
    log(msg, ...args);
  };
}

const splitRE = /\r?\n/;

export function numberToPos(
  source: string,
  offset: number | { line: number; column: number },
): { line: number; column: number } {
  if (typeof offset !== 'number') return offset;
  if (offset > source.length) {
    throw new Error(
      `offset is longer than source length! offset ${offset} > length ${source.length}`,
    );
  }
  const lines = source.split(splitRE);
  let counted = 0;
  let line = 0;
  let column = 0;
  for (; line < lines.length; line++) {
    const lineLength = lines[line].length + 1;
    if (counted + lineLength >= offset) {
      column = offset - counted + 1;
      break;
    }
    counted += lineLength;
  }
  return { line: line + 1, column };
}

export function posToNumber(
  source: string,
  pos: number | { line: number; column: number },
): number {
  if (typeof pos === 'number') return pos;
  const lines = source.split(splitRE);
  const { line, column } = pos;
  let start = 0;
  for (let i = 0; i < line - 1; i++) {
    if (lines[i]) {
      start += lines[i].length + 1;
    }
  }
  return start + column;
}

const range = 2;

export function generateCodeFrame(
  source: string,
  start: number | { line: number; column: number } = 0,
  end?: number,
): string {
  start = posToNumber(source, start);
  end = end || start;
  const lines = source.split(splitRE);
  let count = 0;
  const res: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`,
        );
        const lineLength = lines[j].length;
        if (j === i) {
          // push underline
          const pad = start - (count - lineLength) + 1;
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start,
          );
          res.push(`   |  ${' '.repeat(pad)}${'^'.repeat(length)}`);
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ${'^'.repeat(length)}`);
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  return res.join('\n');
}

const nullSourceMap: RawSourceMap = {
  names: [],
  sources: [],
  mappings: '',
  version: 3,
};

export function combineSourcemaps(
  filename: string,
  sourcemapList: Array<DecodedSourceMap | RawSourceMap>,
): RawSourceMap {
  if (
    sourcemapList.length === 0 ||
    sourcemapList.every((m) => m.sources.length === 0)
  ) {
    return { ...nullSourceMap };
  }

  // We don't declare type here so we can convert/fake/map as RawSourceMap
  let map; // : SourceMap
  let mapIndex = 1;
  const useArrayInterface =
    sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === undefined;
  if (useArrayInterface) {
    map = remapping(sourcemapList, () => null, true);
  } else {
    map = remapping(
      sourcemapList[0],
      (sourcefile) => {
        if (sourcefile === filename && sourcemapList[mapIndex]) {
          return sourcemapList[mapIndex++];
        } else {
          return { ...nullSourceMap };
        }
      },
      true,
    );
  }
  if (!map.file) {
    delete map.file;
  }

  return map as RawSourceMap;
}

export const require = createRequire(import.meta.url);

export const safeRequire = (filePath: string) => {
  try {
    // FIXME: how to require file without require
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(filePath);
  } catch (e) {
    return {};
  }
};

/**
 * check if path is dir
 * @param name
 * @returns Promise<Boolean>
 */
export const isDirectory =
  (name: string) => fs.existsSync(name) && fs.statSync(name).isDirectory();

export const isFile = (name: string) => fs.existsSync(name) && fs.statSync(name).isFile();

export const isObject = (value: unknown): value is Record<string, any> => Object.prototype.toString.call(value) === '[object Object]';

export const booleanToObject = (value: object | boolean): object => (isObject(value) ? value : {});

export function debouncePromise<T extends unknown[]>(
  fn: (...args: T) => Promise<OutputResult[]>,
  delay: number,
  onError: (err: unknown) => void,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  let promiseInFly: Promise<void> | undefined;

  let callbackPending: (() => void) | undefined;

  return function debounced(...args: Parameters<typeof fn>) {
    if (promiseInFly) {
      callbackPending = () => {
        debounced(...args);
        callbackPending = undefined;
      };
    } else {
      if (timeout != null) clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(() => {
          timeout = undefined;
          promiseInFly = fn(...args)
            .then((outputResults) => {
              resolve(outputResults);
            })
            .catch(onError)
            .finally(() => {
              promiseInFly = undefined;
              if (callbackPending) callbackPending();
            });
        }, delay);
      });
    }
  };
}

// Build time 0-500ms Green
//            500-3000 Yellow
//            3000-    Red
export const timeFrom = (start: number, subtract = 0): string => {
  const time: number | string = performance.now() - start - subtract;
  const timeString = (`${time.toFixed(2)} ms`).padEnd(5, ' ');
  if (time < 500) {
    return picocolors.green(timeString);
  } else if (time < 3000) {
    return picocolors.yellow(timeString);
  } else {
    return picocolors.red(timeString);
  }
};

export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const stringifyObject = (obj: PlainObject) => {
  return Object.keys(obj).reduce((pre, next) => {
    return {
      ...pre,
      [next]: JSON.stringify(obj[next]),
    };
  }, {});
};

// @ref: It will pass to createScriptFilter function
export function getIncludeNodeModuleScripts(compileDependencies: boolean | Array<RegExp | string>): RegExp[] {
  if (compileDependencies === true || (Array.isArray(compileDependencies) && compileDependencies.length === 0)) {
    return [/node_modules/];
  }
  if (Array.isArray(compileDependencies) && compileDependencies.length > 0) {
    // compile all deps in node_modules except compileDependencies
    // for example: now only want to compile abc and @ice/abc deps.
    // will generate the regular expression: /node_modules(?:\/|\\\\)(abc|@ice\/abc)(?:\/|\\\\)(?!node_modules).*/
    // will match:
    // 1. node_modules/abc/index.js
    // 2. node_modules/def/node_modules/abc/index.js
    // 3. node_modules/@ice/abc/index.js
    // 4. node_modules/def/node_modules/@ice/abc/index.js
    // will not match:
    // node_modules/abc/node_modules/def/index.js
    // node_modules/def/index.js
    return [new RegExp(`node_modules/(${compileDependencies.map((dep: string | RegExp) => (`${typeof dep === 'string' ? dep : dep.source}`)).join('|')})/(?!node_modules).*.[cm]?[jt]sx?$`)];
  }
  // default
  return [];
}

/**
 * @reason cnpm node_modules path is different from npm/pnpm, it will not match the compileDependencies
 *
 * @example transform react/node_modules/_idb@7.1.1@idb/build/index.js to react/node_modules/idb/build/index.js
 */
export function formatCnpmDepFilepath(filepath: string) {
  const reg = /(.*(?:\/|\\\\))(?:_.*@(?:\d+)\.(?:\d+)\.(?:\d+)(?:-(?:(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?:[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?@)(.*)/;
  const matchedResult = filepath.match(reg);
  if (!matchedResult) {
    return filepath;
  }
  const [, p1, p2] = matchedResult;
  return p1 + p2;
}

/**
 * default include src/**.m?[jt]sx? but exclude .d.ts file
 *
 * @param extraInclude include other file types
 * @param extraExclude exclude other file types
 *
 * @example exclude node_modules createScriptsFilter([], [/node_modules/])
 */
export const createScriptsFilter = (
  extraIncludes: RegExp[] = [],
  extraExcludes: RegExp[] = [],
) => {
  const includes = [/src\/.*\.[cm]?[jt]sx?$/].concat(extraIncludes);
  const excludes = [/\.d\.ts$/, /core-js/, /core-js-pure/, /tslib/, /@swc\/helpers/, /@babel\/runtime/, /babel-runtime/].concat(extraExcludes);

  return createFilter(includes, excludes);
};

export const cwd = process.cwd();

export function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/');
}

export function mergeValueToTaskConfig<C = TaskConfig, T = any>(config: C, key: string, value: T): C {
  if (Array.isArray(value)) {
    return {
      ...config,
      [key]: value,
    };
  } else if (typeof value === 'object') {
    return {
      ...config,
      [key]: {
        ...(config[key] || {}),
        ...value,
      },
    };
  } else {
    config[key] = value;
    return config;
  }
}

export function getEntryItems(entry: TaskConfig['entry']) {
  const entries = typeof entry === 'string' ? [entry] : Array.isArray(entry) ? entry : Object.values(entry);
  return entries;
}

const pkg = loadPkg(cwd);

export function checkDependencyExists(dependency: string, link: string) {
  if (!pkg?.dependencies?.[dependency]) {
    consola.error(`当前组件/库依赖 \`${dependency}\`, 请运行命令 \`npm i ${dependency} --save\` 安装此依赖。更多详情请看 \`${link}\``);
    process.exit(1);
  }
  return pkg?.dependencies?.[dependency];
}

export const getBuiltInPlugins = () => [
  require.resolve('./plugins/component'),
];
