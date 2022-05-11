import { extname, relative } from 'path';
import { createFilter } from '@rollup/pluginutils';
import { dtsCompile } from '../helpers/dts.js';
import { isEcmascriptOnly, isTypescriptOnly } from '../helpers/suffix.js';

import type { Plugin } from 'rollup';
import type { UserConfig } from '../types.js';
import type { DtsInputFile, FileExt } from '../helpers/dts.js';

const dtsFilter = createFilter(
  /\.m?[jt]sx?$/, // include
  /node_modules/, // exclude
);

interface CachedContent extends DtsInputFile {
  srcCode: string;
  updated?: boolean;
}

const cachedContents: Record<string, CachedContent> = {};

// dtsPlugin is used to generate declartion file when transforming
function dtsPlugin(entry: string, generateTypesForJs?: UserConfig['generateTypesForJs']): Plugin {
  const ids: string[] = [];
  return {
    name: 'ice-pkg:dts',
    transform(_, id) {
      if (dtsFilter(id)) {
        if (!cachedContents[id]) {
          cachedContents[id] = {
            srcCode: _,
            updated: true,
            ext: extname(id) as FileExt,
            filePath: id,
          };
        } else if (cachedContents[id].srcCode === _) {
          cachedContents[id].updated = false;
        } else {
          cachedContents[id].srcCode = _;
          cachedContents[id].updated = true;
        }

        ids.push(id);
      }
      // Always return null to escape transforming
      return null;
    },

    buildEnd() {
      const compileIds = ids
        .filter(
          (id) =>
            isTypescriptOnly(cachedContents[id].ext, id)
          || (generateTypesForJs && isEcmascriptOnly(cachedContents[id].ext, id)),
        );

      // should re-run typescript programs
      const shouldUpdateDts = compileIds.some((id) => cachedContents[id].updated);

      let dtsFiles;
      if (shouldUpdateDts) {
        const compileFiles = compileIds.map((id) => ({
          ext: cachedContents[id].ext,
          filePath: id,
        }));
        dtsFiles = dtsCompile(compileFiles);
      } else {
        dtsFiles = ids.map((id) => cachedContents[id]);
      }

      dtsFiles.forEach((file) => {
        this.emitFile({
          type: 'asset',
          fileName: relative(entry, file.dtsPath),
          source: file.dtsContent,
        });

        cachedContents[file.filePath] = {
          ...cachedContents[file.filePath],
          ...file,
        };
      });
    },
  };
}

export default dtsPlugin;
