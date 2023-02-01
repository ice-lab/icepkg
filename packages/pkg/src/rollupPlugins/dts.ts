import { extname, relative } from 'path';
import { createFilter } from '@rollup/pluginutils';
import { dtsCompile, type File } from '../helpers/dts.js';
import { getTransformEntryDirs } from '../helpers/getTaskIO.js';

import type { Plugin } from 'rollup';
import type { TaskConfig, UserConfig } from '../types.js';
import type { DtsInputFile, FileExt } from '../helpers/dts.js';

interface CachedContent extends DtsInputFile {
  updated: boolean;
}

interface DtsPluginOptions {
  rootDir: string;
  entry: Record<string, string>;
  alias: TaskConfig['alias'];
  outputDir: string;
  generateTypesForJs?: UserConfig['generateTypesForJs'];
}

// dtsPlugin is used to generate declaration file when transforming
function dtsPlugin({
  rootDir,
  entry,
  alias,
  generateTypesForJs,
  outputDir,
}: DtsPluginOptions): Plugin {
  const includeFileRegexps = [/\.m?tsx?$/];
  if (generateTypesForJs) {
    includeFileRegexps.push(/\.m?jsx?$/);
  }
  const dtsFilter = createFilter(
    includeFileRegexps, // include
    [/node_modules/, /\.d\.[cm]?ts$/], // exclude
  );
  // Actually, it's useful in dev.
  const cachedContents: Record<string, CachedContent> = {};

  return {
    name: 'ice-pkg:dts',
    transform(code, id) {
      if (dtsFilter(id)) {
        if (!cachedContents[id]) {
          cachedContents[id] = {
            srcCode: code,
            updated: true,
            ext: extname(id) as FileExt,
            filePath: id,
          };
        } else if (cachedContents[id].srcCode !== code) {
          cachedContents[id].srcCode = code;
          cachedContents[id].updated = true;
        }
      }
      // Always return null to escape transforming
      return null;
    },

    async buildEnd() {
      // should re-run typescript programs
      const updatedIds = Object.keys(cachedContents).filter((id) => cachedContents[id].updated);

      let dtsFiles: DtsInputFile[];
      if (updatedIds.length) {
        const files: File[] = updatedIds.map((id) => ({
          ext: cachedContents[id].ext,
          filePath: id,
          srcCode: cachedContents[id].srcCode,
        }));
        dtsFiles = await dtsCompile({ files, alias, rootDir, outputDir });
      } else {
        dtsFiles = Object.keys(cachedContents).map((id) => {
          const { updated, ...rest } = cachedContents[id];
          return { ...rest };
        });
      }
      const entries = getTransformEntryDirs(rootDir, entry);
      entries.forEach((entryItem) => {
        dtsFiles.forEach((file) => {
          this.emitFile({
            type: 'asset',
            fileName: relative(entryItem, file.dtsPath),
            source: file.dtsContent,
          });

          cachedContents[file.filePath] = {
            ...cachedContents[file.filePath],
            ...file,
          };
        });
      });

      updatedIds.forEach((updateId) => { cachedContents[updateId].updated = false; });
    },
  };
}

export default dtsPlugin;
