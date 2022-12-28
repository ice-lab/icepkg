import { extname, relative } from 'path';
import { createFilter } from '@rollup/pluginutils';
import { dtsCompile } from '../helpers/dts.js';
import { isEcmascriptOnly, isTypescriptOnly } from '../helpers/suffix.js';

import type { Plugin } from 'rollup';
import type { TaskConfig, UserConfig } from '../types.js';
import type { DtsInputFile, FileExt } from '../helpers/dts.js';


interface CachedContent extends DtsInputFile {
  updated?: boolean;
}

const cachedContents: Record<string, CachedContent> = {};

// dtsPlugin is used to generate declaration file when transforming
function dtsPlugin(entry: TaskConfig['entry'], generateTypesForJs?: UserConfig['generateTypesForJs']): Plugin {
  const ids: string[] = [];
  const includeFileRegexps = [/\.m?tsx?$/];
  if (generateTypesForJs) {
    includeFileRegexps.push(/\.m?jsx?$/);
  }
  const dtsFilter = createFilter(
    includeFileRegexps, // include
    [/node_modules/, /\.d\.[cm]?ts$/], // exclude
  );
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
        } else if (cachedContents[id].srcCode === code) {
          cachedContents[id].updated = false;
        } else {
          cachedContents[id].srcCode = code;
          cachedContents[id].updated = true;
        }

        ids.push(id);
      }
      // Always return null to escape transforming
      return null;
    },

    buildEnd() {
      const compileIds = ids
        .filter((id) => isTypescriptOnly(cachedContents[id].ext, id) ||
          (generateTypesForJs && isEcmascriptOnly(cachedContents[id].ext, id)));

      // should re-run typescript programs
      const shouldUpdateDts = compileIds.some((id) => cachedContents[id].updated);

      let dtsFiles: CachedContent[];
      if (shouldUpdateDts) {
        const compileFiles = compileIds.map((id) => ({
          ext: cachedContents[id].ext,
          filePath: id,
          srcCode: cachedContents[id].srcCode,
        }));
        dtsFiles = dtsCompile(compileFiles);
      } else {
        dtsFiles = ids.map((id) => cachedContents[id]);
      }
      const entries = typeof entry === 'string' ? [entry] : Array.isArray(entry) ? entry : Object.keys(entry);
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
    },
  };
}

export default dtsPlugin;
