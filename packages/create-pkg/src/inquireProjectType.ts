import inquirer from 'inquirer';

export async function inquireProjectType() {
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      message: 'please select project type',
      name: 'projectType',
      default: 'react-component',
      choices: [{
        name: 'React component',
        value: 'react',
      }, {
        name: 'JS API',
        value: 'api',
      }, {
        name: 'Rax component',
        value: 'rax',
      }],
    },
  ]);
  return projectType;
}
