import * as path from 'path';
import * as fs from 'fs-extra';
import { downloadMaterialTemplate, generateMaterial } from '..';

jest.setTimeout(60 * 1000);

const registry = 'https://registry.npmjs.org';
const tmpPath = path.resolve(__dirname, '../../.tmp');
fs.removeSync(tmpPath);

test('generate component', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-component');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'component',
    templateOptions: {
      npmName: '@ali/ice-label',
      adaptor: true,
    },
    enableDefPublish: true,
    enablePegasus: true,
  });
});

test('generate block', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-block');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'block',
    templateOptions: {
      npmName: '@ali/ice-label-block',
    },
  });
});

test('generate scaffold', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-scaffold');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'scaffold',
    templateOptions: {
      npmName: '@ali/ice-label-scaffold',
    },
  });
});

test('generate rax component', async () => {
  const projectDir = path.resolve(tmpPath, 'rax-component');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/template-rax', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'component',
    templateOptions: {
      npmName: 'rax-example',
      projectTargets: ['web', 'miniapp'],
      miniappComponentBuildType: 'runtime',
      isAliInternal: false
    },
  });
  const webPath = path.join(projectDir, 'src/web');
  expect(fs.existsSync(webPath)).toBeTrue();
  const miniappPath = path.join(projectDir, 'src/miniapp');
  expect(fs.existsSync(miniappPath)).toBeTrue();
  const weexPath = path.join(projectDir, 'src/weex');
  expect(fs.existsSync(weexPath)).toBeFalse();
  const entryContent = fs.readFileSync(path.join(projectDir, 'src/index.tsx'), 'utf-8');
  expect(entryContent).toEqual(`import { isWeb, isMiniApp } from 'universal-env';
let MyComponent;
if (isWeb) {
  MyComponent = require('./web').default;
} else if (isMiniApp) {
  MyComponent = require('./miniapp').default;
} else {
  // Use web as default implement for SSR or other web like containers
  MyComponent = require('./web').default;
}
export default MyComponent;`);
});
