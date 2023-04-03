/* eslint-disable @typescript-eslint/no-require-imports */
import { isAbsolute, resolve } from 'path';
import fse = require('fs-extra');
import unified = require('unified');
import packageJSON = require('../../package.json');
import stringify = require('remark-stringify');
import mdAstBuilder = require('mdast-builder');
import generateComponentInfo from '../generateComponentInfo';
import remarkParse = require('remark-parse');
import remarkGfm = require('remark-gfm');
import remarkRehype = require('remark-rehype');
import rehypeStringify = require('rehype-stringify');

import type { VFile } from 'vfile';
import type { Node } from 'unist';

const { table, tableCell, tableRow, text, root, inlineCode } = mdAstBuilder;

const { name: packageName } = packageJSON;

interface PropDescriptor {
  defaultValue?: { value?: string; computed: boolean };
  description?: string;
  /**
   * PropTypes
   * @link https://github.com/reactjs/react-docgen/tree/5.x#proptypes
   */
  type?: { name: string; value?: Array<{ name: string }>; raw?: string };
  /**
   * TypeScript or Flow type
   * @link https://github.com/reactjs/react-docgen/tree/5.x#flow-and-typescript-support
   */
  flowType?: { name: string; raw?: string };
  required: boolean;
}

export default function renderComponentPropsToTable(node: Node, vfile: VFile) {
  // Match `<ReactDocgenProps path="component-path"></ReactDocgenProps>`
  const matchComponentPropsTable = (node as any).value.match(
    /<ReactDocgenProps path=['"]([\s\S]+)['"](?:(?:[\s\S])*?)<\/ReactDocgenProps>/,
  );

  if (matchComponentPropsTable === null) {
    return null;
  }

  const [, path] = matchComponentPropsTable;
  const absComponentPath = isAbsolute(path) ? path : resolve(vfile.dirname, path);
  if (!fse.pathExistsSync(absComponentPath)) {
    throw new Error(`[${packageName}] path \`${path}\` does not exist.`);
  }

  const info = generateComponentInfo(absComponentPath);

  const mdTable = unified()
    // @ts-ignore
    .use(stringify, {})
    .stringify(root([
      table(
        ['center', 'center', 'center', 'center', 'center'],
        [
          tableRow([
            tableCell(text('属性')),
            tableCell(text('描述')),
            tableCell(text('类型')),
            tableCell(text('必填')),
            tableCell(text('默认值')),
          ]),
          ...Object.entries(info.props)
            .map(([key, propDescriptor]: [string, PropDescriptor]) => renderTableRowProp(key, propDescriptor)),
        ],
      ),
    ]));
  const file = unified()
    // @ts-ignore
    .use(remarkParse) // Parse markdown.
    // @ts-ignore
    .use(remarkGfm) // Support GFM (tables, autolinks, tasklists, strikethrough).
    // @ts-ignore
    .use(remarkRehype) // Turn it into HTML.
    // @ts-ignore
    .use(rehypeStringify) // Serialize HTML.
    .processSync(mdTable);

  return String(file);
}

function renderTableRowProp(name: string, propDescriptor: PropDescriptor) {
  return tableRow([
    // 属性
    tableCell(text(name)),
    // 描述
    tableCell(text(propDescriptor.description || '-')),
    // 类型
    tableCell(inlineCode(handleType(propDescriptor.type || propDescriptor.flowType) || '-')),
    // 必填
    tableCell(text(propDescriptor.required ? '✅' : '❌')),
    // 默认值
    tableCell(inlineCode(propDescriptor.defaultValue?.value || '-')),
  ]);
}

function handleType(type: PropDescriptor['flowType'] | PropDescriptor['type']) {
  if (!type) {
    return undefined;
  }
  if (type.name === 'union') {
    if (isType(type)) {
      return type.value.map(({ name }) => name).join(' \\| ');
    } else {
      return type.raw.split('|').join('\\|');
    }
  } else if (type.name === 'custom') {
    return type.raw;
  }
  return type.name;
}

function isType(type: any): type is PropDescriptor['type'] {
  return !!type.value;
}
