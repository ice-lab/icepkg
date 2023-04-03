/* eslint-disable @typescript-eslint/no-require-imports */
import visit = require('unist-util-visit');
import renderComponentPropsToTable from './renderers/renderComponentPropsToTable';

import type { Plugin } from 'unified';

const remarkReactDocgenPlugin: Plugin = () => {
  return (tree, vfile) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'jsx' && (node as any).value) {
        const componentPropsTable = renderComponentPropsToTable(node, vfile);
        if (componentPropsTable) {
          parent.children.splice(index, 1, {
            type: 'html',
            value: componentPropsTable,
          } as any);
        }
      }
    });
  };
};

module.exports = remarkReactDocgenPlugin;
