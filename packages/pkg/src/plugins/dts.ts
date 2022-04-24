import { extname, relative } from 'path';
import { createFilter } from '@rollup/pluginutils';
import dtsCompile from '../helpers/dts.js';
import { isEcmascriptOnly, isTypescriptOnly } from '../helpers/suffix.js';

import type { Plugin } from 'rollup';
import type { UserConfig } from '../types';

const dtsFilter = createFilter(
  /\.m?[jt]sx?$/, // include
  /node_modules/, // exclude
);

const cachedContents: Record<string, {
  srcCode: string;
  updated?: boolean;
  ext?: string;
  generatedCode?: string;
  [index: string]: any;
}> = {};

// dtsPlugin is used to generate declartion file when transforming
function dtsPlugin(entry: string, generateTypesForJs?: UserConfig['generateTypesForJs']): Plugin {
  const ids: string[] = [];
  return {
    name: 'ice-pkg:dts',
    transform(_, id) {
      if (dtsFilter(id)) {
        if (!cachedContents[id]) {
          cachedContents[id] = { srcCode: _, updated: true, ext: extname(id) };
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

      const shouldUpdateDts = compileIds.some((id) => cachedContents[id].updated);

      let dtsFiles;
      if (shouldUpdateDts) {
        const compileFiles = compileIds.map((id) => ({
          ext: cachedContents[id].ext,
          filePath: id,
        }));
        // @ts-ignore
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
