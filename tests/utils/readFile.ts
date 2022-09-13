import fs from 'fs';
import path from 'path';

export function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/');
}

export default function readFile(
  distPath: string,
  parentPath = '',
  fileMap: Record<string, string> = {},
) {
  fs.readdirSync(distPath, { withFileTypes: true }).forEach((item) => {
    if (item.isFile()) {
      fileMap[normalizeSlashes(path.join(parentPath, item.name))] = fs.readFileSync(
        path.join(distPath, item.name),
        'utf-8',
      );
    } else if (item.isDirectory()) {
      readFile(
        path.join(distPath, item.name),
        path.join(parentPath, item.name),
        fileMap,
      );
    }
  });

  return fileMap;
}
