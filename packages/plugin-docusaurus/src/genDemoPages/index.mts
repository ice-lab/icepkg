import path from 'path';
import * as directoryTree from 'directory-tree';
import type { DirectoryTree } from 'directory-tree';
import fse from 'fs-extra';
import { unified } from 'unified';
import getExtractCodePlugin from './extractCodePlugin.mjs';
import parse from 'remark-parse';
import stringify from 'remark-stringify';

function scanDocsDirectory(rootDir: string): DirectoryTree | null {
  const docsDir = path.join(rootDir, 'docs');
  const tree = directoryTree.default(docsDir, { extensions: /\.md$/ });
  return tree;
}

function extractCodeFromDocs(docsTree: DirectoryTree, rootDir: string): void {
  docsTree.children?.forEach((sub) => {
    if (sub.children) {
      extractCodeFromDocs(sub, rootDir);
    } else {
      const content = fse.readFileSync(sub.path, 'utf-8');
      unified()
        .use(parse)
        .use(stringify)
        .use(getExtractCodePlugin(sub.path, rootDir))
        .process(content);
    }
  });
}

export default function genDemoPages(rootDir: string): void {
  const docsTree = scanDocsDirectory(rootDir);
  if (docsTree) {
    extractCodeFromDocs(docsTree, rootDir);
  }
}
