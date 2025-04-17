import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as semver from 'semver';
import * as zlib from 'zlib';
import * as tar from 'tar';
import * as fse from 'fs-extra';
import { ALI_NPM_REGISTRY, ALI_UNPKG_URL } from '@appworks/constant';
import axios from 'axios';
import urlJoin from 'url-join';

import type { AxiosResponse } from 'axios';

/**
 * 获取指定 npm 包版本的 tarball
 */
function getNpmTarball(npm: string, version?: string, registry?: string): Promise<string> {
  return getNpmInfo(npm, registry).then((json: any) => {
    if (!semver.valid(version)) {
      // support beta or other tag
      version = json['dist-tags'][version] || json['dist-tags'].latest;
    }

    if (semver.valid(version) && json.versions && json.versions[version] && json.versions[version].dist) {
      return json.versions[version].dist.tarball;
    }

    return Promise.reject(new Error(`没有在 ${registry} 源上找到 ${npm}@${version} 包`));
  });
}

/**
 * 获取 tar 并将其解压到指定的文件夹
 */
function getAndExtractTarball(
  destDir: string,
  tarball: string,

  progressFunc = (state) => {},
  formatFilename = (filename: string): string => {
    // 为了兼容
    if (filename === '_package.json') {
      return filename.replace(/^_/, '');
    } else {
      return filename.replace(/^_/, '.');
    }
  },
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const allFiles = [];
    const allWriteStream = [];
    const dirCollector = [];

    axios({
      url: tarball,
      timeout: 10000,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        progressFunc(progressEvent);
      },
    }).then((response) => {
      const totalLength = Number(response.headers['content-length']);
      let downloadLength = 0;
      response.data
        // @ts-ignore
        .on('data', (chunk) => {
          downloadLength += chunk.length;
          progressFunc({
            percent: (downloadLength - 50) / totalLength,
          });
        })
        // @ts-ignore
        .pipe(zlib.Unzip())
        // @ts-ignore
        .pipe(new tar.Parse())
        .on('entry', (entry) => {
          if (entry.type === 'Directory') {
            entry.resume();
            return;
          }

          const realPath = entry.path.replace(/^package\//, '');

          let filename = path.basename(realPath);
          filename = formatFilename(filename);

          const destPath = path.join(destDir, path.dirname(realPath), filename);
          const dirToBeCreate = path.dirname(destPath);
          if (!dirCollector.includes(dirToBeCreate)) {
            dirCollector.push(dirToBeCreate);
            mkdirp.sync(dirToBeCreate);
          }

          allFiles.push(destPath);
          allWriteStream.push(
            new Promise((streamResolve) => {
              entry
                .pipe(
                  fse.createWriteStream(destPath, {
                    mode: entry.mode,
                  }),
                )
                .on('finish', () => streamResolve(true))
                .on('close', () => streamResolve(true)); // resolve when file is empty in node v8
            }),
          );
        })
        .on('end', () => {
          if (progressFunc) {
            progressFunc({
              percent: 1,
            });
          }

          Promise.all(allWriteStream)
            .then(() => resolve(allFiles))
            .catch(reject);
        });
    });
  });
}

/**
 * 从 registry 获取 npm 的信息
 */
function getNpmInfo(npm: string, registry?: string): Promise<any> {
  const register = registry || getNpmRegistry(npm);
  const url = urlJoin(register, npm);

  return axios({ url }).then((response) => {
    return response.data;
  });
}

/**
 * 获取某个 npm 的所有版本号
 */
function getVersions(npm: string, registry?: string): Promise<string[]> {
  return getNpmInfo(npm, registry).then((body: any) => {
    const versions = Object.keys(body.versions);
    return versions;
  });
}

/**
 * 根据指定范围（比如：1.x，< 5.x），获取符合的所有版本号
 */
function getSatisfiesVersions(npm: string, range: string, registry?: string) {
  return getVersions(npm, registry).then((versions) => {
    return versions
      .filter((version) => semver.satisfies(version, range))
      .sort((a, b) => {
        return semver.gt(b, a);
      });
  });
}

/**
 * 根据指定 version 获取符合 semver 规范的最新版本号
 *
 * @param {String} baseVersion 指定的基准 version
 * @param {Array} versions
 */
function getLatestSemverVersion(baseVersion: string, versions: string[]): string {
  versions = versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => {
      return semver.gt(b, a) ? 1 : -1;
    });
  return versions[0];
}

/**
 * 根据指定 version 和包名获取符合 semver 规范的最新版本号
 *
 * @param {String} npm 包名
 * @param {String} baseVersion 指定的基准 version
 */
function getNpmLatestSemverVersion(npm: string, baseVersion: string, registry?: string): Promise<string> {
  return getVersions(npm, registry).then((versions) => {
    return getLatestSemverVersion(baseVersion, versions);
  });
}

/**
 * 获取某个 npm 的最新版本号
 *
 * @param {String} npm
 */
function getLatestVersion(npm, registry?: string): Promise<string> {
  return getNpmInfo(npm, registry).then((data) => {
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      console.error('没有 latest 版本号', data);
      return Promise.reject(new Error('Error: 没有 latest 版本号'));
    }

    const latestVersion = data['dist-tags'].latest;
    return latestVersion;
  });
}

function isAliNpm(npmName?: string): boolean {
  return /^(@alife|@ali|@alipay|@kaola)\//.test(npmName);
}

function getNpmRegistry(npmName = ''): string {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  }

  if (isAliNpm(npmName)) {
    return ALI_NPM_REGISTRY;
  }

  return 'https://registry.npmmirror.com';
}

function getUnpkgHost(npmName = ''): string {
  if (process.env.UNPKG) {
    return process.env.UNPKG;
  }

  if (isAliNpm(npmName)) {
    return ALI_UNPKG_URL;
  }

  return 'https://unpkg.com';
}

function getNpmClient(npmName = ''): string {
  if (process.env.NPM_CLIENT) {
    return process.env.NPM_CLIENT;
  }

  if (isAliNpm(npmName)) {
    return 'tnpm';
  }

  return 'npm';
}

function checkAliInternal(): Promise<boolean> {
  return axios({
    url: 'https://alilang-intranet.alibaba-inc.com/is_white_list.json',
    timeout: 3 * 1000,
  })
    .then((response: AxiosResponse<any>) => {
      const { data } = response;
      return response.data && data.content === true && data.hasError === false;
    })
    .catch((err) => {
      return false;
    });
}

const packageJSONFilename = 'package.json';

async function readPackageJSON(projectPath: string) {
  const packagePath = path.join(projectPath, packageJSONFilename);
  const packagePathIsExist = await fse.pathExists(packagePath);
  if (!packagePathIsExist) {
    throw new Error("Project's package.json file not found in local environment");
  }
  const content = await fse.readJson(packagePath);
  return content;
}

/**
 * 获取已安装在本地的模块版本号
 *
 * @param projectPath
 * @param packageName
 */
function getPackageLocalVersion(projectPath: string, packageName: string): string {
  const packageJsonPath = path.join(projectPath, 'node_modules', packageName, 'package.json');
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

export {
  getLatestVersion,
  getNpmLatestSemverVersion,
  getNpmRegistry,
  getUnpkgHost,
  getNpmClient,
  getVersions,
  getSatisfiesVersions,
  isAliNpm,
  getNpmInfo,
  checkAliInternal,
  getNpmTarball,
  getAndExtractTarball,
  packageJSONFilename,
  readPackageJSON,
  getPackageLocalVersion,
};
