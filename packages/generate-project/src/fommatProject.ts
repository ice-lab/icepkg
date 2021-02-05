import * as path from 'path';
import * as fse from 'fs-extra';
import { ALI_YUEQU_URL } from '@iceworks/constant';
import { checkAliInternal } from 'ice-npm-utils';

export default async function formatProject(projectDir: string, projectName?: string): Promise<void> {
  await fse.remove(path.join(projectDir, 'build'));

  let abcData = {};
  const abcPath = path.join(projectDir, 'abc.json');
  const pkgPath = path.join(projectDir, 'package.json');
  const pkgData = fse.readJsonSync(pkgPath);
  const isAliInternal = await checkAliInternal();
  const initialVersion = '0.1.0';

  pkgData.dependencies = pkgData.dependencies || {};
  pkgData.devDependencies = pkgData.devDependencies || {};

  // 通过 pkg.bizTeam 定制生成逻辑
  const bizTeam: 'govfe' | null = pkgData.bizTeam;

  console.log('clean package.json...');

  // modify package.json
  if (bizTeam !== 'govfe') {
    pkgData.private = true;
  }
  pkgData.originTemplate = pkgData.name;
  if (projectName) {
    pkgData.name = projectName;
  }
  pkgData.version = initialVersion;
  delete pkgData.files;
  delete pkgData.bizTeam;
  delete pkgData.publishConfig;
  delete pkgData.scaffoldConfig;
  delete pkgData.homepage;
  if (pkgData.scripts) {
    delete pkgData.scripts.screenshot;
    delete pkgData.scripts.prepublishOnly;
  }
  delete pkgData.devDependencies['@ice/screenshot'];

  // modify build.json
  const buildJsonPath = path.join(projectDir, 'build.json');
  if (fse.existsSync(buildJsonPath)) {
    const buildData = fse.readJsonSync(buildJsonPath);
    buildData.plugins = buildData.plugins || [];

    delete buildData.publicPath;

    // generate abcData && add plugin-def to build.json&package.json
    if (isAliInternal && bizTeam !== 'govfe') {
      if (pkgData.dependencies.rax) {
        // For Rax project
        abcData = {
          type: 'rax',
          builder: '@ali/builder-rax-v1',
          info: {
            raxVersion: '1.x',
          },
        };

        let defPluginVersion = '^3.0.0';
        if (pkgData.devDependencies['build-plugin-rax-app'] && !pkgData.devDependencies['rax-app']) {
          // 兼容 rax-app@2.0
          defPluginVersion = '^1.0.2';
        }

        // add @ali/build-plugin-rax-app-def
        pkgData.devDependencies['@ali/build-plugin-rax-app-def'] = defPluginVersion;
        buildData.plugins.push('@ali/build-plugin-rax-app-def');

        // TODO: remove src/app.js for mpa project
        // if (
        //   (buildData.web && buildData.web.mpa)
        //   || buildData.mpa // 未来有可能把 mpa 提上去
        // ) {
        //   try {
        //     fse.removeSync(path.join(projectDir, './src/app.js'));
        //     fse.removeSync(path.join(projectDir, './src/app.ts'));
        //   } catch (err) {
        //     // ignore error
        //   }
        // }
      } else {
        abcData = {
          type: 'ice-app',
          builder: '@ali/builder-ice-app',
        };

        // add @ali/build-plugin-ice-def
        pkgData.devDependencies['@ali/build-plugin-ice-def'] = '^0.1.0';
        buildData.plugins.push('@ali/build-plugin-ice-def');
      }
    }
    // delete build-plugin-fusion-material
    const index = buildData.plugins.findIndex((item) => {
      const pluginName = typeof item === 'string' ? item : item[0];
      return pluginName === 'build-plugin-fusion-material';
    });
    if (index !== -1) {
      buildData.plugins.splice(index, 1);
      delete pkgData.devDependencies['build-plugin-fusion-material'];
    }

    fse.writeJSONSync(buildJsonPath, buildData, {
      spaces: 2,
    });
  } else if (pkgData.devDependencies['ice-scripts']) {
    const buildVersion = pkgData.devDependencies['ice-scripts'];
    // ^1.y.z, ~1.y.z, 1.x
    const is1X = /^(\^|~|)1\./.test(buildVersion);
    abcData = {
      type: 'ice-scripts',
      builder: is1X ? '@ali/builder-iceworks' : '@ali/builder-ice-scripts',
    };

    if (!is1X) {
      // TODO: 操作 ice.config.js 加入 ice-plugin-def；删除 publicPath；
      console.log(`If you need to deploy with DEF, please refer to the doc: ${ALI_YUEQU_URL}`);
    } else if (pkgData.buildConfig) {
      delete pkgData.buildConfig.output;
      delete pkgData.buildConfig.localization;
    }
  }

  if (isAliInternal && !fse.existsSync(abcPath)) {
    fse.writeJSONSync(abcPath, abcData, {
      spaces: 2,
    });
  }

  fse.writeJSONSync(pkgPath, pkgData, {
    spaces: 2,
  });
}
