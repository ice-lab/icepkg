import { isAbsolute, resolve, join } from 'path';
import { isDirectory } from '../utils.js';
import type { TaskValue } from '../types.js';

const DEFAULT_ENTRY_DIR = 'src';

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

export const getTransformEntryDirs = (rootDir: string, entry: Record<string, string>) => {
  const entries = Object.values(entry);
  const transformEntryDirs: string[] = [];

  entries.forEach((entryItem) => {
    const absoluteEntry = isAbsolute(entryItem) ? entryItem : resolve(rootDir, entryItem);
    transformEntryDirs.push(join(absoluteEntry, '..'));
  });

  return transformEntryDirs;
};

export const getOutputDir = (rootDir: string, taskName: TaskValue) => {
  if (taskName.includes('transform')) {
    return resolve(rootDir, taskName.split('-')[1]);
  }
  return resolve(rootDir, 'dist');
};
