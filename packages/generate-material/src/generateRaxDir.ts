import * as path from 'path';
import * as fse from 'fs-extra';
import { ITemplateOptions, EnvTypeMap } from './types';

const ENV_MAP = {
  web: 'isWeb',
  weex: 'isWeex',
  miniapp: 'isMiniApp',
  'wechat-miniprogram': 'isWechatMiniProgram',
  kraken: 'isKraken',
};

export default (rootDir: string, templateOptions: ITemplateOptions) => {
  const targets: (keyof EnvTypeMap)[] = templateOptions.projectTargets;

  // Remove not expected target dir
  Object.keys(ENV_MAP)
    .filter((target: keyof EnvTypeMap) => !targets.includes(target))
    .forEach(target => {
      const dir = path.join(rootDir, 'src', target);
      fse.removeSync(dir);
    });

  // Generate entry file
  const entryPath = fse.existsSync(path.join(rootDir, 'tsconfig.json')) ? 'src/index.tsx' : 'src/index.js';
  let entryContent = 'let MyComponent;';
  const importList = [];
  //
  /**
   * Make web as the first
   * Example:
   * let MyComponent;
   * if (isWeb) {
   *   MyComponent = require('./web').default;
   * } else if (isMiniApp) {
   *   MyComponent = require('./miniapp').default;
   * } else {
   *   MyComponent = require('./web').default;
   * }
   */
  if (targets.includes('web')) {
    entryContent += `
if (isWeb) {
  MyComponent = require('./web').default;
}`;
    targets.forEach(target => {
      if (target !== 'web') {
        entryContent += ` else if (${ENV_MAP[target]}) {
  MyComponent = require('./${target}').default;
}`;
      }
    });
    entryContent += ` else {
  // Use web as default implement for SSR or other web like containers
  MyComponent = require('./web').default;
}`;
  } else {
    /**
     * Example:
     * let MyComponent;
     * if (isMiniApp) {
     *   MyComponent = require('./miniapp').default;
     * }
     */
    targets.forEach((target, index) => {
      if (index === 0) {
        // New line for first if condition
        entryContent += '\n';
      } else {
        entryContent += ' else ';
      }
      entryContent += `if (${ENV_MAP[target]}) {
  MyComponent = require('./${target}').default;
}`;
    });
  }
  targets.forEach(target => {
    importList.push(ENV_MAP[target]);
  });
  // import { isWeb, isMiniApp } from 'universal-env';
  entryContent = `import { ${importList.join(', ')} } from 'universal-env';\n` + entryContent + '\nexport default MyComponent;';
  fse.writeFileSync(path.join(rootDir, entryPath), entryContent);
};
