import fse from 'fs-extra';
import * as path from 'path';

/**
 * If we create a sub package in monorepo workspace, we need to delete some files and content which don't need.
 */
export default async function removeFilesAndContent(dir: string) {
  await removeFiles(dir);
  await deleteFieldsInPkgJSON(dir);
}

const uselessFiles: string[] = [
  '.gitignore',

  '.eslintrc.cjs',
  '.eslintrc.js',
  '.eslintrc',
  '.eslintignore',

  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc',
  '.stylelintignore',

  'abc.json',
];

async function removeFiles(dir: string) {
  for (const file of uselessFiles) {
    const filePath = path.join(dir, file);
    if (await fse.pathExists(filePath)) {
      await fse.remove(filePath);
    }
  }
}

const uselessFields: Record<string, string[]> = {
  scripts: ['eslint', 'eslint:fix', 'stylelint', 'stylelint:fix', 'lint'],
  devDependencies: ['stylelint', 'eslint', '@applint/spec'],
};

async function deleteFieldsInPkgJSON(dir: string) {
  const pkgJSONPath = path.join(dir, 'package.json');
  const pkgJSON = await fse.readJSON(pkgJSONPath);
  Object.entries(uselessFields).forEach(([field, properties]) => {
    properties.forEach((property) => {
      delete pkgJSON[field][property];
    });
  });
  await fse.writeJSON(pkgJSONPath, pkgJSON, { spaces: 2 });
}
