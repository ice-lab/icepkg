import * as inquirer from 'inquirer';
import log from '../../utils/log';
import goldlog from '../../utils/goldlog';
import checkEmpty from '../../utils/checkEmpty';
import initMaterialAndComponent from './initMaterialAndComponent';

interface IOptions {
  rootDir?: string;
  npmName?: string;
  type?: string;
}

export default async function (options: IOptions = {}): Promise<void> {
  const cwd = options.rootDir || process.cwd();
  let { npmName, type } = options;
  log.verbose('iceworks init options', options as string);

  if (options.type && options.type === 'project') {
    console.log('');
    log.warn('', 'Please use `npm init ice ice-example` init icejs project.');
    console.log('');
    process.exit(-1);
  }

  const go = await checkEmpty(cwd);
  if (!go) process.exit(1);

  if (!options.type) {
    type = await selectType();
  }
  if (!options.npmName) {
    npmName = await selectTemplate(type);
  }

  goldlog('init', { npmName, type });
  log.verbose('iceworks init', type, npmName);

  await initMaterialAndComponent({
    cwd,
    projectType: type,
    template: npmName,
  });
}

/**
 * 选择初始项目类型
 */
async function selectType(): Promise<string> {
  const DEFAULT_TYPE = 'material';
  return inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: 'Please select a type',
      default: DEFAULT_TYPE,
      choices: [
        {
          name: 'material collection(component&scaffold&block&page)',
          value: 'material',
        },
        {
          name: 'component',
          value: 'component',
        },
      ],
    })
    .then((answer) => answer.type);
}

/**
 * 选择使用的模板
 *
 * @param {String} type project|material|component
 */
async function selectTemplate(type: string): Promise<string> {
  // 针对不同 init 类型的内置模板
  const typeToTemplates = {
    material: [{
      npmName: '@icedesign/ice-react-ts-material-template',
      description: 'React + TypeScript',
    }, {
      npmName: '@icedesign/ice-react-material-template',
      description: 'React + JavaScript',
      default: true,
    }, {
      npmName: '@icedesign/ice-vue-material-template',
      description: 'Vue + JavaScript',
    }, {
      npmName: '@icedesign/template-rax',
      description: 'Rax + TypeScript',
    }],
    component: [{
      npmName: '@icedesign/ice-react-ts-material-template',
      description: 'React + TypeScript',
    }, {
      npmName: '@icedesign/ice-react-material-template',
      description: 'React + JavaScript',
      default: true,
    }, {
      npmName: '@icedesign/template-rax',
      description: 'Rax + TypeScript',
    }, {
      npmName: '@icedesign/template-icestark-module',
      description: 'Icestark Module + React + TypeScript',
    }],
  };
  const templates = typeToTemplates[type];
  const defaultTemplate = templates.find((item) => item.default === true);

  return inquirer
    .prompt({
      type: 'list',
      name: 'template',
      message: 'Please select a template',
      default: defaultTemplate,
      choices: templates.map((item) => {
        return {
          name: item.description,
          value: item.npmName,
        };
      }),
    })
    .then((answer) => answer.template);
}
