import { resolve } from 'path';
import { isDirectory } from '../utils.js';
import type { TaskValue } from '../types.js';

export function formatEntry(inputEntry: string | string[] | Record<string, string>): Record<string, string> {
  const entry = {};
  if (typeof inputEntry === 'string') {
    entry[getEntryId(inputEntry)] = inputEntry;
  } else if (Array.isArray(inputEntry)) {
    inputEntry.forEach((item) => {
      entry[getEntryId(item)] = item;
    });
  } else if (typeof inputEntry === 'object') {
    Object.keys(inputEntry).forEach((key) => {
      entry[key] = inputEntry[key];
    });
  }
  return entry;
}

// Eg. src/index.js => index
function getEntryId(entry: string): string {
  return entry.split('/').pop().split('.').shift();
}

const DEFAULT_ENTRY_DIR = 'src';

export const getDefaultEntryDir = (rootDir: string, entryDir = DEFAULT_ENTRY_DIR) => {
  entryDir = resolve(rootDir, entryDir);

  if (!isDirectory(entryDir)) {
    throw new Error(`Failed to resolve ${entryDir} as an entry directory.`);
  }

  return entryDir;
};

export const getOutputDir = (rootDir: string, taskName: TaskValue) => {
  if (taskName.includes('transform')) {
    return resolve(rootDir, taskName.split('-')[1]);
  }
  return resolve(rootDir, 'dist');
};
