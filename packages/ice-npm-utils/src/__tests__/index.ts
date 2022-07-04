import 'jest-extended';
import * as path from 'path';
import { tmpdir } from 'os';
import * as rimraf from 'rimraf';
import { ALI_NPM_REGISTRY, ALI_UNPKG_URL } from '@appworks/constant';
import {
  getNpmRegistry,
  getUnpkgHost,
  getNpmLatestSemverVersion,
  getSatisfiesVersions,
  getLatestVersion,
  getNpmInfo,
  getNpmClient,
  checkAliInternal,
  getNpmTarball,
  getAndExtractTarball,
} from '../index';

const defaultRegistry = 'https://registry.npmmirror.com';
// 预留 cnpm 返回多个源的可能性
const registies = [defaultRegistry];

jest.setTimeout(10 * 1000);


test('getNpmRegistry', () => {
  expect(getNpmRegistry('koa')).toBe(defaultRegistry);
  expect(getNpmRegistry('@alixxx/ice-test')).toBe(defaultRegistry);
  expect(getNpmRegistry('@ali/ice-test')).toBe(ALI_NPM_REGISTRY);
  expect(getNpmRegistry('@alife/ice-test')).toBe(ALI_NPM_REGISTRY);
  expect(getNpmRegistry('@alipay/ice-test')).toBe(ALI_NPM_REGISTRY);
});

test('getUnpkgHost custom host', () => {
  const custom = 'https://unpkg.example.com';

  process.env.UNPKG = custom;

  expect(getUnpkgHost('koa')).toBe(custom);
  expect(getUnpkgHost('@ali/ice-test')).toBe(custom);

  delete process.env.UNPKG;
});

test('getUnpkgHost', () => {
  const defaultRegistry = 'https://unpkg.com';

  expect(getUnpkgHost('koa')).toBe(defaultRegistry);
  expect(getUnpkgHost('@ali/ice-test')).toBe(ALI_UNPKG_URL);
  expect(getUnpkgHost('@alife/ice-test')).toBe(ALI_UNPKG_URL);
  expect(getUnpkgHost('@alipay/ice-test')).toBe(ALI_UNPKG_URL);
  expect(getUnpkgHost('@kaola/ice-test')).toBe(ALI_UNPKG_URL);
  expect(getUnpkgHost('@alixxx/ice-test')).toBe(defaultRegistry);
});

test('getLatestVersion should throw error when no dist-tags', () => {
  return getLatestVersion('http').catch((err) => {
    expect(err).toMatch('error');
  });
});

test('getLatestVersion', () => {
  // 找一个非常稳定的包
  return getLatestVersion('co').then((version) => {
    expect(version).toBe('4.6.0');
  });
});

test('getNpmLatestSemverVersion', () => {
  // 找一个非常稳定的包
  return getNpmLatestSemverVersion('co', '3.0.0').then((version) => {
    expect(version).toBe('3.1.0');
  });
});

test('getSatisfiesVersions', () => {
  // 找一个非常稳定的包
  return getSatisfiesVersions('co', '<= 1.1').then((versions) => {
    expect(versions).toEqual(['1.1.0', '1.0.0']);
  });
});

test('getNpmInfo success', () => {
  return getNpmInfo('koa').then((data) => {
    expect(data.name).toBe('koa');
  });
});

test('getNpmInfo 404 error case', () => {
  return getNpmInfo('not-exis-npm-error').catch((err) => {
    expect(err.statusCode).toBe(404);
  });
});

test('getNpmClient custom registry', () => {
  const custom = 'cnpm';
  process.env.NPM_CLIENT = custom;

  expect(getNpmClient('koa')).toBe(custom);
  expect(getNpmClient('@ali/ice-test')).toBe(custom);

  delete process.env.NPM_CLIENT;
});

test('getNpmClient', () => {
  const defaultData = 'npm';
  const ali = 'tnpm';

  expect(getNpmClient('koa')).toBe(defaultData);
  expect(getNpmClient('@ali/ice-test')).toBe(ali);
  expect(getNpmClient('@alife/ice-test')).toBe(ali);
  expect(getNpmClient('@alipay/ice-test')).toBe(ali);
  expect(getNpmClient('@kaola/ice-test')).toBe(ali);
  expect(getNpmClient('@alixxx/ice-test')).toBe(defaultData);
});

test('checkAliInternal', () => {
  return checkAliInternal().then((internal) => {
    console.log('checkAliInternal', internal);
    expect(internal).toBeBoolean();
    // expect().toBeInstanceOf();
  });
});

test('getNpmTarball', () => {
  return getNpmTarball('ice-npm-utils', '1.0.0').then((tarball) => {
    console.log('getNpmTarball ice-npm-utils', tarball);
    expect(
      registies.some(registry => tarball === `${registry}/ice-npm-utils/-/ice-npm-utils-1.0.0.tgz`)
    ).toBeTruthy();
  });
});

test('getNpmTarball should get latest version', () => {
  return getNpmTarball('http').then((tarball) => {
    console.log('getNpmTarball http', tarball);
    expect(
      registies.some(registry => tarball === `${registry}/http/-/http-0.0.1-security.tgz`)
    ).toBeTruthy();
  });
});

test('getAndExtractTarball', () => {
  const tempDir = path.resolve(tmpdir(), 'ice_npm_utils_tarball');
  return getAndExtractTarball(tempDir, `${defaultRegistry}/ice-npm-utils/-/ice-npm-utils-1.0.0.tgz`)
    .then((files) => {
      rimraf.sync(tempDir);
      expect(files.length > 0).toBe(true);
    })
    .catch(() => {
      rimraf.sync(tempDir);
    });
});

test('getAndExtractTarballWithDir', () => {
  const tempDir = path.resolve(tmpdir(), 'babel_helper_function_name_tarball');
  return getAndExtractTarball(
    tempDir,
    `${defaultRegistry}/@babel/helper-function-name/download/@babel/helper-function-name-7.1.0.tgz`
  )
    .then((files) => {
      rimraf.sync(tempDir);
      expect(files.length > 0).toBe(true);
    })
    .catch(() => {
      rimraf.sync(tempDir);
    });
});
