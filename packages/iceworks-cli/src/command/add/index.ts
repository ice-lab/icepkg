import * as path from 'path';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import { downloadMaterialTemplate } from '@iceworks/generate-material';

import goldlog from '../../utils/goldlog';
import log from '../../utils/log';
import addBlockToProject from './addBlockToProject';
import addSingleMaterial from '../init/addSingleMaterial';
import getNpmRegistry from '../../utils/getNpmRegistry';
import { TEMP_PATH } from '../../utils/constants';

export default async (options) => {
  const destDir = options.rootDir || process.cwd();
  // eslint-disable-next-line prefer-const
  let { materialType, npmName } = options;

  goldlog('add', { materialType, npmName });

  if (!materialType && npmName) {
    await addBlockToProject(options, destDir);
    return;
  }

  const materialPkg = await fse.readJson(path.join(destDir, 'package.json'));
  const { materialConfig, name = '' } = materialPkg;
  const nameParts = name.split('/');
  const npmScope = nameParts[1] ? nameParts[0] : null;

  log.verbose('iceworks add', options, npmScope);

  if (!materialConfig) {
    throw new Error('Invalid ice materials project, Missing `materialConfig` property in package.json file.');
  }
  if (!materialConfig.template) {
    throw new Error('Missing `materialConfig.template` property in package.json file.');
  }

  const { template,pageTemplate } = materialConfig;

  const registry = await getNpmRegistry(template, materialConfig, null, true);
  const materialDir = TEMP_PATH;

  if(materialType === 'block'){
    await downloadMaterialTemplate(materialDir, template, registry);
  } else {
    // TODO : download from npm differently
    // 由于我不能发布 @iceworks/ 类型的包，现在的包名为 ice-react-ts-page-material-template-beta
    // 应为 @iceworks/ice-react-ts-page-material-template-beta
    await downloadMaterialTemplate(materialDir, 
      pageTemplate ||'ice-react-ts-page-material-template-beta',
      registry);
  }
  
  if (!materialType) {
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'materialType',
      message: 'Please select material type',
      choices: ['block', 'component', 'scaffold','page'],
    }]);
    materialType = answers.materialType;
  }

  await addSingleMaterial({
    materialDir,
    cwd: destDir,
    useDefaultOptions: false,
    npmScope,
    materialType,
    projectType: 'material',
  });

  // remove temp dir
  await fse.remove(materialDir);
};
