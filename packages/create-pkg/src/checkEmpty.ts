import fs from 'fs-extra';

export async function checkEmpty(dir: string): Promise<boolean> {
  let files: string[] = fs.readdirSync(dir);
  files = files.filter((filename) => {
    return ['node_modules', '.git', '.DS_Store', '.iceworks-tmp', 'build', '.bzbconfig'].indexOf(filename) === -1;
  });
  if (files.length && files.length > 0) {
    return false;
  } else {
    return true;
  }
}
