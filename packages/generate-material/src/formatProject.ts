import * as path from 'path';
import * as fse from 'fs-extra';
import { isAliNpm } from 'ice-npm-utils';
import { ITemplateOptions, EnvMapType } from './types';
import generateEntryFile from './template/generateEntryFile';
import { ENV_MAP } from './constants';

interface IOptions {
  rootDir: string;
  templateOptions?: ITemplateOptions;
  enableDefPublish?: boolean;
  enablePegasus?: boolean;
  materialType?: 'component' | 'block' | 'scaffold';
}

export default async function formatProject({
  rootDir,
  templateOptions,
  enableDefPublish,
  enablePegasus,
  materialType,
}: IOptions): Promise<void> {
  const { npmName } = templateOptions;
  const abcPath = path.join(rootDir, 'abc.json');
  const pkgPath = path.join(rootDir, 'package.json');
  const buildJsonPath = path.join(rootDir, 'build.json');
  const buildData = fse.readJsonSync(buildJsonPath);
  const pkgData = fse.readJsonSync(pkgPath);
  let abcData = null;

  if (isAliNpm(npmName)) {
    pkgData.publishConfig = {
      registry: 'https://registry.npm.alibaba-inc.com',
    };
  }

  if (materialType === 'component' || enableDefPublish || enablePegasus) {
    abcData = {
      builder: '@ali/builder-component',
    };

    if (enablePegasus) {
      pkgData.devDependencies['@ali/build-plugin-rax-seed'] = '^2.0.0';
      buildData.plugins.push([
        '@ali/build-plugin-rax-seed',
        {
          majorVersionIsolation: false,
        },
      ]);
    }
  }

  const targets = templateOptions.projectTargets;
  if (materialType === 'component' && Array.isArray(targets)) {
    const wholeTargets = Object.keys(ENV_MAP) as (keyof EnvMapType)[];
    let uselessTargets = [];
    if (targets.length > 1 && templateOptions.miniappComponentBuildType === 'runtime') {
      uselessTargets = wholeTargets.filter((target: keyof EnvMapType) => !targets.includes(target));
      // Generate src/index.tsx
      generateEntryFile(rootDir, templateOptions);
    } else {
      uselessTargets = wholeTargets;
    }
    // Remove not expected target dir
    removeUselessDir(rootDir, uselessTargets);
  }

  abcData && fse.writeJSONSync(abcPath, abcData, { spaces: 2 });
  fse.writeJSONSync(buildJsonPath, buildData, { spaces: 2 });
  fse.writeJSONSync(pkgPath, pkgData, { spaces: 2 });
}

function removeUselessDir(rootDir: string, targets: (keyof EnvMapType)[]) {
  targets.forEach(target => {
    const dir = path.join(rootDir, 'src', target);
    fse.removeSync(dir);
  });
}
