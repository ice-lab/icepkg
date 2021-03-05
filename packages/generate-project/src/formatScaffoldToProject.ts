import formatFilename from './formatFilename';
import formatProject from './formatProject';
import * as readFiles from 'fs-readdir-recursive';
import * as fse from 'fs-extra';
import * as path from 'path';

export default async function formatScaffoldToProject(scaffoldDir: string) {
  // format filename
  const files = readFiles(scaffoldDir);
  files.forEach((file) => {
    fse.renameSync(path.join(scaffoldDir, file), path.join(scaffoldDir, formatFilename(file)));
  });
  // format project
  await formatProject(scaffoldDir);
}
