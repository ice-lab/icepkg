import { isAbsolute, resolve, join, relative, dirname } from 'node:path';
import { TransformTaskConfig } from '../types.js';

export function formatEntry(inputEntry?: string | string[] | Record<string, string>): Record<string, string> {
  const entry: Record<string, string> = {};
  if (!inputEntry) return entry;
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
  return entry.split('/').pop()!.split('.').shift()!;
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

export const getCommonAncestorDir = (paths: string[]) => {
  if (!paths.length) {
    return '';
  }

  let commonPath = resolve(paths[0]);

  for (let i = 1; i < paths.length; i++) {
    const currentPath = resolve(paths[i]);

    while (!isPathInDir(currentPath, commonPath)) {
      const parentPath = dirname(commonPath);
      if (parentPath === commonPath) {
        break;
      }
      commonPath = parentPath;
    }
  }

  return commonPath;
};

export const getTransformEntryRoot = (rootDir: string, entry: Record<string, string>, configuredEntryRoot?: string) => {
  const entryDirs = getTransformEntryDirs(rootDir, entry);
  const autoEntryRoot = entryDirs.length ? getCommonAncestorDir(entryDirs) : resolve(rootDir);

  if (!configuredEntryRoot) {
    return autoEntryRoot;
  }

  const resolvedEntryRoot = isAbsolute(configuredEntryRoot)
    ? configuredEntryRoot
    : resolve(rootDir, configuredEntryRoot);
  const invalidEntryDir = entryDirs.find((entryDir) => !isPathInDir(entryDir, resolvedEntryRoot));

  if (invalidEntryDir) {
    throw new Error(
      `Invalid entryRoot "${configuredEntryRoot}". Expected a common ancestor of all transform entries, but "${invalidEntryDir}" is outside it.`,
    );
  }

  return resolvedEntryRoot;
};

function isPathInDir(filePath: string, dirPath: string) {
  const relativePath = relative(resolve(dirPath), resolve(filePath));
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
}

export const getTransformDefaultOutputDir = (rootDir: string, taskName: string, config: TransformTaskConfig) => {
  if (config.pkg) {
    return resolve(rootDir, config.pkg.id);
  }
  return resolve(rootDir, taskName.split('-')[1]);
};
