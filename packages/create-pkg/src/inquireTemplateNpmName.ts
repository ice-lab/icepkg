import inquirer from 'inquirer';
import getInfo from './langs/index.js';


export default async function inquireTemplateNpmName(workspace?: boolean) {
  const info = await getInfo();
  const baseTemplateChoices = [
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
  ];
  const monorepoTemplateChoices = [
    {
      name: info.reactMonorepo,
      value: '@ice/template-pkg-monorepo-react',
    },
    {
      name: info.nodeMonorepo,
      value: '@ice/template-pkg-monorepo-node',
    },
  ];
  // If create a sub package(the cli flag is `-w`), don't show the monorepo templates.
  const choices = baseTemplateChoices.concat(!workspace ? monorepoTemplateChoices : []);
  const { templateNpmName } = await inquirer.prompt([
    {
      type: 'list',
      message: info.selectProjectType,
      name: 'templateNpmName',
      default: '@ice/template-pkg-react',
      choices,
    },
  ]);
  return templateNpmName;
}
