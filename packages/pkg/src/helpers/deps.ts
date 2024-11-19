import { loadPkg } from './load.js';
import consola from 'consola';

const pkg = loadPkg(process.cwd());

export function checkDependencyExists(dependency: string, link: string) {
  if (!pkg?.dependencies?.[dependency]) {
    consola.error(`当前组件/库依赖 \`${dependency}\`, 请运行命令 \`npm i ${dependency} --save\` 安装此依赖。更多详情请看 \`${link}\``);
    process.exit(1);
  }
  return pkg?.dependencies?.[dependency];
}
