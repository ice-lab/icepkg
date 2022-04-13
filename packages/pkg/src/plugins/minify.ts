import * as swc from '@swc/core';

import type { JsMinifyOptions } from '@swc/core';
import type { RollupPluginFn } from '../types.js';

const minifyPlugin: RollupPluginFn<{
  minifyOption: true | JsMinifyOptions;
}> = ({ minifyOption }) => {
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
        // FIXME: sourcemaps
        // sourceMap: !!extraSwcOptions.sourceMaps,
      });
    },
  };
};

export default minifyPlugin;
