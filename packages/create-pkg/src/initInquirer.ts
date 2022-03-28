
import inquirer from 'inquirer';
import { checkAliInternal } from 'ice-npm-utils';
import validateName from 'validate-npm-package-name';
import { generateNpmName } from './generateNpmName.js';

function getRestInquirers (npmScope: string, cwd: string) {
  return [
    {
      type: 'input',
      name: 'name',
      message: 'component name',
      default: 'ExampleComponent',
      validate: (value) => {
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
          return `Name must be a Upper Camel Case word, e.g. ExampleComponent}.`;
        }

        const npmName = generateNpmName(value, npmScope);
        if (!validateName(npmName).validForNewPackages) {
          return `NPM package name ${npmName} not validate, please retry`;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'title',
      message: 'title',
      default: 'demo component',
      validate: (value) => {
        if (!value) {
          return 'title cannot be empty';
        }
        return true;
      },
      filter(value) {
        return value.trim();
      },
    },
    {
      type: 'string',
      required: true,
      name: 'version',
      message: 'version',
      default: '1.0.0',
    },
    {
      type: 'string',
      required: true,
      name: 'description',
      message: 'description',
      default: 'intro component',
      filter(value) {
        return value.trim();
      },
      validate: (value) => {
        if (!value) {
          return 'description cannot be empty';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'category',
      message: 'category',
      default: 'Information',
      choices: [
        'Table',
        'Form',
        'Chart',
        'List',
        'Modal',
        'Filter',
        'DataDisplay',
        'Information',
        'Others',
      ],
      filter: (answer) => {
        return answer;
      },
    },
  ]
}

export async function initInquirer (cwd: string) {
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

  const { npmScope } = forIntranet
    ? await inquirer.prompt([
        {
          type: 'list',
          message: 'please select the npm scope',
          name: 'npmScope',
          default: '@ali',
          choices: ['@ali', '@alife', '@alipay', '@kaola'],
        },
      ])
    : await inquirer.prompt([
        {
          type: 'input',
          message: 'npm scope (eg: @ice)',
          name: 'npmScope',
          validate: (value) => {
            if (value && !/^@/.test(value)) {
              return 'npm scope should starts with @, eg: @ice';
            }
            return true;
          },
        },
      ]);

  const restInquirers = getRestInquirers(npmScope, cwd);

  const answers = await inquirer.prompt(restInquirers);

  // Format
  answers.npmScope = npmScope;
  answers.npmName = generateNpmName(answers.name, npmScope);

  return answers;
}