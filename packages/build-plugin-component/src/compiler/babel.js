/**
 * @file generate es and lib by babel.
 * @author tony7lee
 */

const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const babel = require('@babel/core');
const { REG_JS } = require('../configs/reg');
const getCompileBabel = require('../utils/getCompileBabel');
const getRaxBabelConfig = require('rax-babel-config');
const { analyzePackage, analyzeDependencies } = require('./depAnalyze');
const dtsCompiler = require('./dts');

const getBabelConfig = ({ target, componentLibs, rootDir, babelPlugins, babelOptions, type }) => {
  const params = target === 'es' ? { modules: false } : {};
  let babelConfig;
  if (type === 'react') {
    babelConfig = getCompileBabel(params, { babelPlugins, babelOptions, rootDir });
  } else {
    babelConfig = getRaxBabelConfig({
      styleSheet: true,
      custom: {
        ignore: ['**/**/*.d.ts'],
      },
      ...params,
    });
    babelConfig.presets.push(require.resolve('@babel/preset-typescript'));
  }
  // generate babel-plugin-import config
  const plugins = [];
  componentLibs.forEach(libraryName => {
    // check es folder if target is es
    const pluginOption = {
      libraryName,
      style: false, // style file will be require in style.js
    };
    if (target === 'es') {
      const libPath = path.join(rootDir, 'node_modules', libraryName, 'es');
      if (fs.existsSync(libPath)) {
        pluginOption.libraryDirectory = 'es';
      }
    }
    plugins.push([
      require.resolve('babel-plugin-import'),
      pluginOption,
      libraryName,
    ]);
  });
  babelConfig.plugins = babelConfig.plugins.concat(plugins);
  return babelConfig;
};

const parseStyleStatement = ({ target, module, rootDir }) => {
  let styleStatement = '';
  const stylePaths = ['style', `${target}/style`];
  if (target === 'es') {
    // compatible for component without es folder
    stylePaths.push('lib/style.js');
  }
  stylePaths.every(stylePath => {
    let keepSearch = true;
    try {
      require.resolve(path.join(rootDir, 'node_modules', module, stylePath));
      styleStatement = `${module}/${stylePath}`;
      keepSearch = false;
    } catch (err) {
      keepSearch = true;
    }
    return keepSearch;
  });
  if (styleStatement) {
    return target === 'es'
      ? `import '${styleStatement}';`
      : `require('${styleStatement}');`;
  }
  return '';
};

module.exports = function babelCompiler(
  context,
  log,
  basicComponents,
  userOptions = {},
  type,
) {
  const { rootDir, pkg } = context;
  const { compilerOptions = {}, babelPlugins = [], babelOptions = [] } = userOptions;
  // generate DTS for ts files, default is true
  const { declaration = true } = compilerOptions;
  const componentLibs = analyzePackage(pkg, basicComponents);
  const srcPath = path.join(rootDir, 'src');
  // compile task es and lib
  const compileTargets = ['es', 'lib'];

  const filesPath = glob.sync('**/*.*', { cwd: srcPath, ignore: ['node_modules/**'] });
  // traverse to compile the js files
  const compileInfo = [];
  compileTargets.forEach(target => {
    const destPath = path.join(rootDir, target);
    // clear dir
    fs.emptyDirSync(destPath);
    filesPath.forEach(filePath => {
      const sourceFile = path.join(srcPath, filePath);
      if (!REG_JS.test(filePath)) {
        // copy file if it does not match REG_JS
        try {
          fs.copySync(sourceFile, path.join(destPath, filePath));
          log.info(`file ${filePath} copy successfully!`);
        } catch (err) {
          log.error(err);
        }
      } else {
        // get babel config for compile
        const libBabelConfig = getBabelConfig({
          target,
          componentLibs,
          rootDir,
          babelPlugins,
          babelOptions,
          type,
        });
        // compile file by babel
        // TODO use context.babel
        const rightPath = filePath.replace(REG_JS, '.js');
        const { code } = babel.transformFileSync(sourceFile, {
          filename: rightPath,
          ...libBabelConfig,
        });
        const targetPath = path.join(destPath, rightPath);
        fs.ensureDirSync(path.dirname(targetPath));
        fs.writeFileSync(targetPath, code, 'utf-8');

        compileInfo.push({
          filePath,
          sourceFile,
          destPath,
        });
      }
    });

    if (type === 'react') {
      // analyze dependencies for generate style.js
      const styleDependencies = analyzeDependencies(
        path.join(rootDir, `${target}/index`),
        rootDir,
        basicComponents,
      );
      // generate style.js
      const stylePath = path.join(destPath, 'style.js');
      // check index.scss and main.scss
      let styleContent = '';
      ['index.scss', 'index.less', 'index.css', 'main.scss'].every(cssFile => {
        if (fs.existsSync(path.join(destPath, cssFile))) {
          styleContent =
            target === 'es'
              ? `import './${cssFile}';`
              : `require('./${cssFile}');`;
          // return false to break loop
          return false;
        }
        return true;
      });
      const styleSatements = styleDependencies
        .map(module => parseStyleStatement({ module, rootDir, target }))
        .join('\n');
      styleContent =
        styleSatements || styleContent
          ? [styleSatements, styleContent].filter(Boolean).join('\n')
          : '//empty file';
      fs.writeFileSync(stylePath, styleContent, 'utf-8');
      log.info(`generate style.js to ${target}`);      
    }
  });
  // generate DTS for TS files
  if (declaration) {
    dtsCompiler(compileInfo, log);
  }
  log.info('Generate es and lib successfully!');
};
