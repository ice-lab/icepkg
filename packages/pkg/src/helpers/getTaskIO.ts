import { isAbsolute, resolve } from 'path';
import { isDirectory } from '../utils.js';
import type { TaskValue } from '../types.js';

const DEFAULT_ENTRY_DIR = 'src';

export const getTransformEntry = (rootDir: string, entryDir = DEFAULT_ENTRY_DIR) => {
  const entry = isAbsolute(entryDir) ? entryDir : resolve(rootDir, entryDir);

  if (!isDirectory(entry)) {
    throw new Error(`Failed to resolve ${entry} as an entry directory.`);
  }

  return entry;
};

export const getOutputDir = (rootDir: string, taskName: TaskValue) => {
  if (taskName.includes('transform')) {
    return resolve(rootDir, taskName.split('-')[1]);
  }
  return resolve(rootDir, 'dist');
};
