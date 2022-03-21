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

// dtsPlugin is used to generate declartion file when transforming
function dtsPlugin(entry: string, generateTypesForJs?: UserConfig['generateTypesForJs']): Plugin {
  const files = [];
  return {
    name: 'ice-pkg-cli:dts',
    transform(_, id) {
      if (dtsFilter(id)) {
        files.push({
          ext: extname(id),
          filePath: id,
        });
      }
      // Always return null to escape transforming
      return null;
    },

    buildEnd() {
      const compileFiles = files
        .filter(
          ({ ext, filePath }) =>
            isTypescriptOnly(ext, filePath)
          || (generateTypesForJs && isEcmascriptOnly(ext, filePath)),
        );

      const dtsFiles = dtsCompile(compileFiles);

      dtsFiles.forEach((file) => {
        this.emitFile({
          type: 'asset',
          fileName: relative(entry, file.dtsPath),
          source: file.dtsContent,
        });
      });
    },
  };
}

export default dtsPlugin;
