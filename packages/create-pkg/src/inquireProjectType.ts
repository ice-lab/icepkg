import inquirer from 'inquirer';
import getInfo from './langs/index.js';

export async function inquireProjectType() {
  const info = await getInfo();
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      message: info.selectProjectType,
      name: 'projectType',
      default: 'react',
      choices: [
        {
          name: info.reactComponent,
          value: 'react',
        },
        {
          name: info.nodeModule,
          value: 'node',
        },
        {
          name: info.webLibrary,
          value: 'web',
        },
        {
          name: info.raxComponent,
          value: 'rax',
        },
      ],
    },
  ]);
  return projectType;
}
