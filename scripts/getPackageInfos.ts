import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

const TIMEOUT = 8000; // ms

export interface IPackageInfo {
  name: string;
  directory: string;
  localVersion: string;
  shouldPublish: boolean;
}

function checkVersionExists(pkg: string, version: string): Promise<boolean> {
  return axios(
    `https://unpkg.com/${pkg}@${version}/`,
    { timeout: TIMEOUT }
  )
    .then((res) => res.status === 200)
    .catch(() => false);
}

export async function getPackageInfos(targetDir: string): Promise<IPackageInfo[]> {
  const packageInfos: IPackageInfo[] = [];
  if (!existsSync(targetDir)) {
    console.log(`[ERROR] Directory ${targetDir} not exist!`);
  } else {
    const packageFolders: string[] = readdirSync(targetDir).filter((filename) => filename[0] !== '.');
    console.log('[PUBLISH] Start check with following packages:');
    await Promise.all(packageFolders.map(async (packageFolder) => {

      const directory = join(targetDir, packageFolder);
      const packageInfoPath = join(directory, 'package.json');

      // Process package info.
      if (existsSync(packageInfoPath)) {

        const packageInfo = JSON.parse(readFileSync(packageInfoPath, 'utf8'));
        const packageName = packageInfo.name || packageFolder;

        console.log(`- ${packageName}`);

        try {
          packageInfos.push({
            name: packageName,
            directory,
            localVersion: packageInfo.version,
            // If localVersion not exist, publish it
            shouldPublish: !await checkVersionExists(packageName, packageInfo.version)
          });
        } catch (e) {
          console.log(`[ERROR] get ${packageName} information failed: `, e);
        }
      } else {
        console.log(`[ERROR] ${packageFolder}'s package.json not found.`);
      }
    }));
  }
  return packageInfos;
}