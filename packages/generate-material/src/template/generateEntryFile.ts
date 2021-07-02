import * as path from 'path';
import * as fse from 'fs-extra';
import { ITemplateOptions, EnvMapType } from '../types';
import { ENV_MAP } from '../constants';

export default (rootDir: string, templateOptions: ITemplateOptions) => {
  const targets: (keyof EnvMapType)[] = templateOptions.projectTargets;

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
  ${addMappedRequire('web')}
}`;
    targets.forEach(target => {
      if (target !== 'web') {
        entryContent += ` else if (${ENV_MAP[target]}) {
  ${addMappedRequire(target)}
}`;
      }
    });
    entryContent += ` else {
  // Use web as default implement for SSR or other web like containers
  ${addMappedRequire('web')}
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
  ${addMappedRequire(target)}
}`;
    });
  }
  targets.forEach(target => {
    importList.push(ENV_MAP[target]);
  });
  // import { isWeb, isMiniApp } from 'universal-env';
  entryContent = `import { ${importList.join(', ')} } from 'universal-env';\n` + entryContent + '\nexport default MyComponent;';
  // Rewrite entry file
  fse.writeFileSync(path.join(rootDir, entryPath), entryContent);
};

function addMappedRequire(target) {
  return `MyComponent = require('./${target}').default;`
}
