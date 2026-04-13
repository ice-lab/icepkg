import { globbySync } from 'globby';
import { join } from 'path';
import * as fs from 'node:fs/promises';
import { safeRequire, toArray } from '../utils.js';

/**
 * load package.json
 * @param cwd
 * @returns
 */
export function loadPkg(cwd: string) {
  return safeRequire(join(cwd, 'package.json'));
}

/**
 * load entry files
 * @param entry
 * @returns
 */
export function loadEntryFiles(entry: string, excludes: string | string[]) {
  return globbySync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', ...toArray(excludes ?? [])],
    onlyFiles: true,
  });
}

export const INCLUDES_UTF8_FILE_TYPE = /\.(js|mjs|mts|ts|jsx|tsx|cjs|cts|css|sass|less|json|html)$/;

export async function loadSource(path: string): Promise<string> {
  try {
    return fs.readFile(path, 'utf-8');
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }

  return '';
}
