import { performance } from 'perf_hooks';
import fs from 'fs-extra';
import picocolors from 'picocolors';
import path from 'path';
import os from 'os';
import debug from 'debug';
import { createRequire } from 'module';
import { createFilter } from '@rollup/pluginutils';

import type { PlainObject } from './types';

import type {
  DecodedSourceMap,
  RawSourceMap,
} from '@ampproject/remapping/dist/types/types';

import remapping from '@ampproject/remapping';

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

const DEFAULT_ENTRY_FILE = [
  'index.js',
  'index.ts',
  'index.mts',
  'index.mjs',
  'index.tsx',
  'index.jsx',
];

export const findDefaultEntryFile = (dirPath: string): string => {
  return DEFAULT_ENTRY_FILE
    .map((value) => path.join(dirPath, value))
    .find((file) => isFile(file));
};

export const isObject = (value: unknown): value is Record<string, any> => Object.prototype.toString.call(value) === '[object Object]';

export const booleanToObject = (value: object | boolean): object => (isObject(value) ? value : {});

export function debouncePromise<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
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

      timeout = setTimeout(() => {
        timeout = undefined;
        promiseInFly = fn(...args)
          .catch(onError)
          .finally(() => {
            promiseInFly = undefined;
            if (callbackPending) callbackPending();
          });
      }, delay);
    }
  };
}

export const timeFrom = (start: number, subtract = 0): string => {
  const time: number | string = performance.now() - start - subtract;
  const timeString = (`${time.toFixed(2)} ms`).padEnd(5, ' ');
  if (time < 10) {
    return picocolors.green(timeString);
  } else if (time < 50) {
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

export const scriptsFilter = createFilter(
  /\.m?[jt]sx?$/, // include
  /node_modules/, // exclude
);
