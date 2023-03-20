import inquirer from 'inquirer';
import getInfo from './langs/index.js';

export default async function inquireTemplateNpmName() {
  const info = await getInfo();
  const { templateNpmName } = await inquirer.prompt([
    {
      type: 'list',
      message: info.selectProjectType,
      name: 'templateNpmName',
      default: '@ice/template-pkg-react',
      choices: [
        {
          name: info.reactComponent,
          value: '@ice/template-pkg-react',
        },
        {
          name: info.nodeModule,
          value: '@ice/template-pkg-node',
        },
        {
          name: info.webLibrary,
          value: '@ice/template-pkg-web',
        },
        {
          name: info.raxComponent,
          value: '@ice/template-pkg-rax',
        },
        {
          name: info.reactMonorepo,
          value: '@ice/template-pkg-monorepo-react',
        },
        {
          name: info.nodeMonorepo,
          value: '@ice/template-pkg-monorepo-node',
        },
      ],
    },
  ]);
  return templateNpmName;
}
