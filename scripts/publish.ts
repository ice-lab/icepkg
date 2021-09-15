import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as fse from 'fs-extra';
import * as axios from 'axios';
import { getVersions } from 'ice-npm-utils';

// Set by github actions
const branchName = process.env.BRANCH_NAME;
const rootDir = join(__dirname, '../');
const REGISTRY = 'https://registry.npmjs.org/';

if (!branchName) {
  throw new Error('Only support publish in GitHub Actions env');
}

(async () => {
  const packageDirs = getPackagesPaths(join(rootDir, 'packages'));

  for (const pkgDir of packageDirs) {
    // eslint-disable-next-line no-await-in-loop
    await publishPackage(pkgDir);
  }

})().catch(err => {
  console.error(err);
  process.exit(1);
});

async function publishPackage(packageDir) {
  const pkgData = await fse.readJSON(join(packageDir, 'package.json'));
  const { version, name } = pkgData;
  const npmTag = branchName === 'master' ? 'latest' : 'beta';

  const versionExist = await checkVersionExist(name, version, REGISTRY);
  if (versionExist) {
    console.log(`${name}@${version} 已存在，无需发布。`);
    return;
  }

  const isProdVersion = /^\d+\.\d+\.\d+$/.test(version);
  if (branchName === 'master' && !isProdVersion) {
    throw new Error(`禁止在 master 分支发布非正式版本 ${version}`);
  }

  if (branchName !== 'master' && isProdVersion) {
    console.log(`非 master 分支 ${branchName}，不发布正式版本 ${version}`);
    return;
  }

  console.log('start publish', version, npmTag);
  execSync('npm install', {
    cwd: packageDir,
    stdio: 'inherit',
  });
  execSync(`npm publish --tag ${npmTag}`, {
    cwd: packageDir,
    stdio: 'inherit',
  });

  console.log('start notify');
  const response = await axios.default({
    url: process.env.DING_WEBHOOK,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: {
      msgtype: 'markdown',
      markdown: {
        title: `${name}@${version} 发布成功`,
        text: `${name}@${version} 发布成功`,
      },
    },
  });
  console.log('notify success', response.data);
}


async function checkVersionExist(name: string, version: string, registry?: string): Promise<boolean> {
  try {
    const versions = await getVersions(name, registry);
    return versions.indexOf(version) !== -1;
  } catch (err) {
    console.error('checkVersionExist error', err);
    return false;
  }
}

function getPackagesPaths(dir) {
  const packagesPaths: string[] = readdirSync(dir).map(dirname => {
    return join(dir, dirname);
  }).filter((dirpath) => {
    return existsSync(join(dirpath, 'package.json'));
  });

  return packagesPaths;
}
