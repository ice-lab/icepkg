import * as swc from '@swc/core';

import type { JsMinifyOptions } from '@swc/core';
import type { RollupPluginFn } from '../types.js';

export interface MinifyPluginOption {
  minifyOption: true | JsMinifyOptions;
  sourceMaps: boolean | 'inline';
}

const minifyPlugin: RollupPluginFn<MinifyPluginOption> = ({
  minifyOption,
  sourceMaps,
}) => {
  return {
    name: 'ice-pkg:minify',

    renderChunk(_) {
      // 这个 Hook 仅在 bunlde 时生效，bundle 时利用这个 hook 进行 minify
      return swc.minifySync(_, {
        ...(typeof minifyOption === 'boolean' ? {
          compress: {
            unused: false,
          },
        } : minifyOption),
        // Rollup will determine whether inlined sourcemap or not
        sourceMap: !!sourceMaps,
      });
    },
  };
};

export default minifyPlugin;
