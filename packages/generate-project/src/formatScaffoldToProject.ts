import formatFilename from './formatFilename';
import formatProject from './formatProject';
import ejsRenderDir from './ejsRenderDir';
import * as readFiles from 'fs-readdir-recursive';
import * as fse from 'fs-extra';
import * as path from 'path';

export default async function formatScaffoldToProject(projectDir: string, projectName?: string, ejsOptions: any = {}) {
  // format filename
  const files = readFiles(projectDir);
  files.forEach((file) => {
    fse.renameSync(path.join(projectDir, file), path.join(projectDir, formatFilename(file)));
  });
  // render ejs template
  await ejsRenderDir(projectDir, ejsOptions);
  // format project
  await formatProject(projectDir, projectName);
}
