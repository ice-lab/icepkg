import { isAbsolute, resolve, join } from 'path';
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

export const getTransformEntryDirs = (rootDir: string, entry: Record<string, string>): string[] => {
  const entries = Object.values(entry);
  const transformEntryDirs = new Set<string>()

  entries.forEach((entryItem) => {
    const absoluteEntry = isAbsolute(entryItem) ? entryItem : resolve(rootDir, entryItem);
    transformEntryDirs.add(join(absoluteEntry, '..'));
  });

  return Array.from(transformEntryDirs);
};

export const getTransformDefaultOutputDir = (rootDir: string, taskName: TaskValue) => {
  return resolve(rootDir, taskName.split('-')[1]);
};
