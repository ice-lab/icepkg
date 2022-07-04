const fse = require('fs-extra');
const path = require('path');
const generateRuntimeMiniappPages = require('../../utils/generateRuntimeMiniappPages');
const generateAppJson = require('../../utils/generateRuntimeAppJson');
const { markdownParser } = require('../../utils/markdownHelper');
const getDemos = require('../../utils/getDemos');
const getDemoDir = require('../../utils/getDemoDir');

const prefix = `Function = function(){ return function() { return Symbol; } }; if (typeof
Function.prototype.call === 'undefined') { Function.prototype.call = function
(context) { context = context || window; context.fn = this; const args =
[...arguments].slice(1); const result = context.fn(...args); delete context.fn;
return result; }; } if (typeof Function.prototype.apply === 'undefined') {
Function.prototype.apply = function (context) { context = context || window;
context.fn = this; let result; if (arguments[1]) { result =
context.fn(...arguments[1]); } else { result = context.fn(); } delete
context.fn; return result; }; }

module.exports = function(window, document) {
  const HTMLElement = window["HTMLElement"];

`;
const suffix = '}';

class BuildWrapper {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { rootDir, targetDir } = this.options;
    const demoDir = getDemoDir(rootDir);

    if (compiler.hooks && compiler.hooks.done && compiler.hooks.done.tap) {
      compiler.hooks.afterEmit.tap('runtime-function-wrapper-plugin', (compilation) => {
        const demos = getDemos(path.join(rootDir, demoDir), markdownParser, rootDir);
        const miniappOutputPath = targetDir;

        // 创建 createDemoDir(path, demoName);
        if (Array.isArray(demos)) {
          // clear pages dir
          fse.removeSync(path.resolve(miniappOutputPath, 'pages'));

          // regenerate miniapp pages
          const demoNames = demos.map((demo) => {
            const { pascalCaseName: name } = demo;

            generateRuntimeMiniappPages(path.resolve(miniappOutputPath, `pages/${name}/`), name);
            return name;
          });

          // regenerate app.json
          generateAppJson(path.resolve(miniappOutputPath, 'app.json'), demoNames);
        }

        const bundleJS = compilation.assets['bundle.js'];
        const bundleCss = compilation.assets['bundle.css.acss'];

        if (bundleJS) {
          const { existsAt, _cachedSource } = bundleJS;

          if (existsAt) {
            fse.outputFileSync(existsAt, `${prefix} ${_cachedSource} \n ${suffix}`);
          }
        }

        // otherwise you need to write to disk explicitly
        if (bundleCss) {
          const { existsAt, _cachedSource } = bundleCss;
          if (existsAt) {
            fse.outputFileSync(existsAt, _cachedSource);
          }
        }
      });
    }
  }
}

module.exports = BuildWrapper;
