import inquirer from 'inquirer';
import getInfo from './langs/index.js';

export async function inquireProjectType() {
  const info = await getInfo();
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      message: info.selectProjectType,
      name: 'projectType',
      default: 'react-component',
      choices: [{
        name: info.npmPackage,
        value: 'npm',
      }, {
        name: info.reactComponent,
        value: 'react',
      }, {
        name: info.raxComponent,
        value: 'rax',
      }],
    },
  ]);
  return projectType;
}
