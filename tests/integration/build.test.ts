import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test, describe } from 'vitest';
import componentService from '../../packages/pkg/lib/index.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import readFile from '../utils/readFile';
import emptyDir from '../utils/emptyDir';

async function buildFixtures(rootDir) {
  await componentService.run({
    command: 'build',
    rootDir,
    configFile: 'ice.config.mts',
    commandArgs: {},
    getBuiltInPlugins: () => [path.join(__dirname, '../../packages/plugin-component/lib/index.js')],
  });
}

describe(`build`, () => {
  test('web', async () => {
    const rootDir = path.join(__dirname, '../fixtures/scenarios/web');
    const esmDir = path.join(rootDir, 'esm');
    await emptyDir(esmDir);
    await buildFixtures(rootDir);
    const files = readFile(esmDir);
    expect(files['index.js']).not.toBeFalsy();
  });

  test('node', async () => {
    const rootDir = path.join(__dirname, '../fixtures/scenarios/node');
    const esmDir = path.join(rootDir, 'esm');
    await emptyDir(esmDir);
    await buildFixtures(rootDir);
    const files = readFile(esmDir);
    expect(files['index.js']).not.toBeFalsy();
  });

  test('react', async () => {
    const rootDir = path.join(__dirname, '../fixtures/scenarios/react');
    const esmDir = path.join(rootDir, 'esm');
    await emptyDir(esmDir);
    await buildFixtures(rootDir);
    const files = readFile(esmDir);
    expect(files['index.js']).not.toBeFalsy();
  });

  test('rax', async () => {
    const rootDir = path.join(__dirname, '../fixtures/scenarios/rax');
    const esmDir = path.join(rootDir, 'esm');
    await emptyDir(esmDir);
    await buildFixtures(rootDir);
    const files = readFile(esmDir);
    expect(files['index.js']).not.toBeFalsy();
  });
});
