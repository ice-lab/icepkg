import { join } from 'path';
import { isDirectory, isFile } from '../utils.js';
import { TaskName } from '../types.js';

const DEFAULT_ENTRY_DIR = 'src';
const DEFAULT_ENTRY_FILE = [
  'index.js',
  'index.ts',
  'index.mts',
  'index.mjs',
  'index.tsx',
  'index.jsx',
];

export const findDefaultEntryFile = (path: string) => {
  return DEFAULT_ENTRY_FILE
    .map((value) => join(path, value))
    .find((file) => isFile(file));
};

export const getEntryFile = (rootDir: string) => {
  const defaultEntryDir = getEntryDir(rootDir);
  const entryFile = findDefaultEntryFile(defaultEntryDir);

  if (entryFile === undefined) {
    throw new Error(`Could not find path ${entryFile}, which be regarded as entry`);
  }

  return entryFile;
};

export const getEntryDir = (rootDir: string) => {
  const defaultEntryDir = join(rootDir, DEFAULT_ENTRY_DIR);

  if (isDirectory(defaultEntryDir)) {
    return defaultEntryDir;
  }

  throw new Error(`Failed to resolve ${defaultEntryDir} as entry directory`);
};

export const getOutputDir = (rootDir: string, taskName: TaskName) => {
  if (taskName.includes('transform')) {
    return join(rootDir, taskName.split('-')[1]);
  }
  return join(rootDir, 'dist');
};
