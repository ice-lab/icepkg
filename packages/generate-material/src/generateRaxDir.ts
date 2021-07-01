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
  const wholeTargets = Object.keys(ENV_MAP) as (keyof EnvTypeMap)[];
  const entryPath = fse.existsSync(path.join(rootDir, 'tsconfig.json')) ? 'src/index.tsx' : 'src/index.js';

  // Use normal template with miniapp compile mode
  if (templateOptions.miniappComponentBuildType === 'compile') {
    fse.writeFileSync(path.join(rootDir, entryPath), `import { createElement } from 'rax';
    import View from 'rax-view';
    import Text from 'rax-text';
    import './index.css';

    const MyComponent = () => {
      return (
        <View>
          <Text className="rax-demo-title">Hello world!</Text>
        </View>
      );
    };

    export default MyComponent;
    `);

    // Remove all target dir in miniapp compile mode
    removeUselessDir(rootDir, wholeTargets);
    return;
  }

  // Remove not expected target dir
  removeUselessDir(rootDir, wholeTargets.filter((target: keyof EnvTypeMap) => !targets.includes(target)));

  // Generate entry file
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

function removeUselessDir(rootDir: string, targets: (keyof EnvTypeMap)[]) {
  targets.forEach(target => {
    const dir = path.join(rootDir, 'src', target);
    fse.removeSync(dir);
  });
}
