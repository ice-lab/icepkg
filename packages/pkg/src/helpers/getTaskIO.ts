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

export const getDefaultEntryFile = (rootDir: string) => {
  const defaultEntryFiles = DEFAULT_ENTRY_FILE.map(
    (defaultEntryFile) => join(DEFAULT_ENTRY_DIR, defaultEntryFile),
  );
  const entryFile = defaultEntryFiles
    .map((file) => join(rootDir, file))
    .find((file) => isFile(file));

  if (entryFile === undefined) {
    throw new Error(`Could not find the default entry file: ${defaultEntryFiles.join(', ')} please check if the entry file exists.`);
  }

  return entryFile;
};

export const getDefaultEntryDir = (rootDir: string) => {
  const defaultEntryDir = join(rootDir, DEFAULT_ENTRY_DIR);

  if (!isDirectory(defaultEntryDir)) {
    throw new Error(`Failed to resolve ${defaultEntryDir} as an entry directory.`);
  }

  return defaultEntryDir;
};

export const getOutputDir = (rootDir: string, taskName: TaskName) => {
  if (taskName.includes('transform')) {
    return join(rootDir, taskName.split('-')[1]);
  }
  return join(rootDir, 'dist');
};
