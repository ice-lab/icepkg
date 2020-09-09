const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const getJestConfig = require('rax-jest-config');
const { WEB, WEEX, MINIAPP, WECHAT_MINIPROGRAM, NODE } = require('./constants');
const getMiniappConfig = require('./configs/rax/miniapp/getBase');
const getBaseWebpack = require('./configs/rax/getBaseWebpack');
const getDistConfig = require('./configs/rax/getDistConfig');
const getUMDConfig = require('./configs/rax/getUMDConfig');
const getES6Config = require('./configs/rax/getES6Config');
const generateRaxEntry = require('./utils/generateRaxEntry');
const getDemoDir = require('./utils/getDemoDir');
const getDemos = require('./utils/getDemos');
const { markdownParser } = require('./utils/markdownHelper');
const defaultUserConfig = require('./configs/userConfig');
const raxUserConfig = require('./configs/rax/userConfig');
const babelCompiler = require('./compiler/babel');
const devCompileLog = require('./utils/raxDevCompileLog');
const buildCompileLog = require('./utils/raxBuildCompileLog');
const getDemoConfig = require('./configs/rax/getDemoConfig');

module.exports = ({ registerTask, registerUserConfig, context, onHook, onGetWebpackConfig, onGetJestConfig, log }) => {
  const { rootDir, userConfig, command } = context;
  const { plugins, targets, ...compileOptions } = userConfig;
  if (!(targets && targets.length)) {
    console.error(chalk.red('rax-plugin-component need to set targets, e.g. ["rax-plugin-component", targets: ["web", "weex"]]'));
    console.log();
    process.exit(1);
  }
  // register user config
  registerUserConfig(defaultUserConfig.concat(raxUserConfig));
  const demoDir = getDemoDir(rootDir);
  const demos = getDemos(path.join(rootDir, demoDir), markdownParser);
  const { entries, serverBundles } = generateRaxEntry(demos, rootDir, targets);
  const demoConfig = getDemoConfig(context, { ...userConfig, entries, demos });
  registerTask('component-demo', demoConfig);
  if (command === 'start') {
    targets.forEach((target) => {
      const options = { ...userConfig, target };
      if ([WEB, WEEX, NODE].includes(target)) {
        // eslint-disable-next-line
        const configDev = require(`./configs/rax/${target}/dev`);
        const defaultConfig = getBaseWebpack(context, options);
        configDev(defaultConfig, context, {...options, entries, serverBundles } );
        registerTask(`component-demo-${target}`, defaultConfig);
      } else if ([MINIAPP, WECHAT_MINIPROGRAM].includes(target)) {
        options[target] = options[target] || {};
        addMiniappTargetParam(target, options[target]);
        const config = getMiniappConfig(context, target, options, onGetWebpackConfig);
        registerTask(`component-demo-${target}`, config);
      }
    });
    onHook('after.start.compile', async(args) => {
      const devUrl = args.url;
      devCompileLog(args, devUrl, targets, entries, rootDir, userConfig);
    });
  } else if (command === 'build') {
    // omitLib just for sfc2mp，not for developer
    const disableGenerateLib = userConfig[MINIAPP] && userConfig[MINIAPP].omitLib;

    // clean build results
    fse.removeSync(path.join(rootDir, 'lib'));
    fse.removeSync(path.join(rootDir, 'dist'));
    fse.removeSync(path.join(rootDir, 'build'));
    fse.removeSync(path.join(rootDir, 'es'));

    targets.forEach(target => {
      const options = { ...userConfig, target };
      if (target === WEB) {
        const distConfig = getDistConfig(context, options);
        const umdConfig = getUMDConfig(context, options);
        const es6Config = getES6Config(context, options);
        registerTask(`component-build-${target}`, distConfig);
        registerTask(`component-build-${target}-umd`, umdConfig);
        registerTask(`component-build-${target}-es6`, es6Config);
      } else if (target === WEEX) {
        const distConfig = getDistConfig(context, {...options, entryName: 'index-weex'});
        registerTask('component-build-weex', distConfig);
      } else if (target === MINIAPP || target === WECHAT_MINIPROGRAM) {
        options[target] = options[target] || {};
        addMiniappTargetParam(target, options[target]);
        const config = getMiniappConfig(context, target, options, onGetWebpackConfig);
        registerTask(`component-build-${target}`, config);
      }
    });
    onHook('before.build.load', async () => {
      if (!disableGenerateLib) {
        babelCompiler(context, log, false, compileOptions, 'rax');
      }
    });
    onHook('after.build.compile', async(args) => {
      buildCompileLog(args, targets, rootDir, userConfig);
    });
  }
  if (command === 'test') {
    // jest config
    onGetJestConfig((jestConfig) => {
      const { moduleNameMapper, ...rest } = jestConfig;
      const defaultJestConfig = getJestConfig({ rootDir, moduleNameMapper });
      return {
        ...defaultJestConfig,
        ...rest,
        // defaultJestConfig.moduleNameMapper already combine jestConfig.moduleNameMapper
        moduleNameMapper: defaultJestConfig.moduleNameMapper,
      };
    });
  }
}

/**
 * Add miniapp target param to match jsx2mp-loader config
 * */
function addMiniappTargetParam(target, originalConfig = {}) {
  switch (target) {
    case WECHAT_MINIPROGRAM:
      originalConfig.platform = 'wechat';
      break;
    default:
      break;
  }
  originalConfig.mode = 'watch';
}