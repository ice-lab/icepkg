import inquirer from 'inquirer';
import { checkAliInternal } from 'ice-npm-utils';
import validateName from 'validate-npm-package-name';
import getInfo from './langs/index.js';

export async function inquirePackageName() {
  const info = await getInfo();
  const isInternal = await checkAliInternal();

  const { npmName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'npmName',
      message: info.packageName,
      default: `${isInternal ? '@ali/' : ''}example-component`,
      validate: (value) => {
        if (!validateName(value).validForNewPackages) {
          return info.packageNameValidateError(value);
        }
        return true;
      },
    },
  ]);

  return npmName;
}
