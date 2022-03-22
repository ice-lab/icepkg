
import * as glob from 'globby';
import { join } from 'path';
import fs from 'fs-extra';
import { safeRequire } from '../utils.js';

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
export function loadEntryFiles(entry: string) {
  return glob.sync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', '*.d.ts'],
    onlyFiles: true,
  });
}

export const INCLUDES_UTF8_FILE_TYPE = /\.(js|mjs|mts|ts|jsx|tsx|css|sass|less|json|html)$/;

export function loadSource(path: string): string {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}
