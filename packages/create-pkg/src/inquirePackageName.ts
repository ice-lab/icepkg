import inquirer from 'inquirer';
import { checkAliInternal } from 'ice-npm-utils';
import validateName from 'validate-npm-package-name';
import getInfo from './langs/index.js';

function generateNpmName(name: string, npmScope?: string): string {
  if (name.charAt(0) === '@') {
    return name;
  }

  return npmScope ? `${npmScope}/${name}` : name;
}

export async function inquirePackageName() {
  const info = await getInfo();
  const isIntranet = checkAliInternal();

  const { forIntranet } = await (isIntranet
    ? inquirer.prompt([
      {
        type: 'confirm',
        message: info.generateIntranetComponent,
        name: 'forIntranet',
      },
    ])
    : { forIntranet: false });

  let npmScope = null;
  if (forIntranet) {
    npmScope = (await inquirer.prompt([
      {
        type: 'list',
        message: info.selectNpmScope,
        name: 'npmScope',
        default: '@ali',
        choices: ['@ali', '@alife', '@alipay', '@kaola'],
      },
    ]))?.npmScope;
  }

  const { npmName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'npmName',
      message: info.packageName,
      default: 'example-component',
      validate: (value) => {
        const name = generateNpmName(value, npmScope);
        if (!validateName(name).validForNewPackages) {
          return info.packageNameValidateError(name);
        }
        return true;
      },
    },
  ]);

  return generateNpmName(npmName, npmScope);
}
