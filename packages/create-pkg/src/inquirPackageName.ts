import inquirer from 'inquirer';
import { checkAliInternal } from 'ice-npm-utils';
import validateName from 'validate-npm-package-name';

function generateNpmName(name: string, npmScope?: string): string {
  if (name.charAt(0) === '@') {
    return name;
  }

  return npmScope ? `${npmScope}/${name}` : name;
}

export async function inquirPackageName() {
  const isIntranet = checkAliInternal();

  const { forIntranet } = await (isIntranet
    ? inquirer.prompt([
      {
        type: 'confirm',
        message: 'generate components that are only available on the Intranet',
        name: 'forIntranet',
      },
    ])
    : { forIntranet: false });

  let npmScope = null;
  if (forIntranet) {
    npmScope = (await inquirer.prompt([
      {
        type: 'list',
        message: 'please select the npm scope',
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
      message: 'package name',
      default: 'example-component',
      validate: (value) => {
        const name = generateNpmName(value, npmScope);
        if (!validateName(name).validForNewPackages) {
          return `NPM package name ${name} not validate, please retry`;
        }
        return true;
      },
    },
  ]);

  return generateNpmName(npmName, npmScope);
}
