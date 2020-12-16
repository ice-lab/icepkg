const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const chokidar = require('chokidar');
const getJestConfig = require('rax-jest-config');
const { WEB, WEEX, MINIAPP, WECHAT_MINIPROGRAM, NODE } = require('./constants');
const getMiniappConfig = require('./configs/rax/miniapp/getBase');
const getHerboxBase = require('./configs/rax/miniapp/getHerboxBase');
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
const modifyPkgHomePage = require('./utils/modifyPkgHomePage');
const getDemoConfig = require('./configs/rax/getDemoConfig');

module.exports = ({ registerTask, registerUserConfig, context, onHook, registerCliOption, onGetWebpackConfig, onGetJestConfig, modifyUserConfig, log }) => {
  const { rootDir, userConfig, command, pkg, commandArgs } = context;
  const { plugins, targets, disableUMD, inlineStyle = true, ...compileOptions } = userConfig;
  if (!(targets && targets.length)) {
    console.error(chalk.red('rax-plugin-component need to set targets, e.g. ["rax-plugin-component", targets: ["web", "weex"]]'));
    process.exit(1);
  }
  const { skipDemo } = commandArgs;
  const watchDist = commandArgs.watchDist || userConfig.watchDist;
  // compatible with rax-seed
  modifyUserConfig('watchDist', !!watchDist);
  // register user config
  registerUserConfig(defaultUserConfig.concat(raxUserConfig));
  // disable demo when watch dist

  const isHerboxConfigExist = fse.existsSync(path.join(rootDir, '.herboxrc.js'));

  let entries = {};
  let serverBundles = {};
  let herboxEntries = {};
  let demos = [];

  // register cli options
  const cliOptions = ['watch-dist', '--skip-demo'];
  registerCliOption(cliOptions.map((name) => ({
    name,
    commands: ['start', 'build'],
  })));
  const demoDir = getDemoDir(rootDir);
  const getRaxBundles = () => {
    if (demoDir) {
      demos = getDemos(path.join(rootDir, demoDir), markdownParser);
      if (demos && demos.length) {
        return generateRaxEntry(demos, rootDir, targets, { isHerboxConfigExist });
      }
    }
    return false;
  };
  if (!watchDist && !skipDemo) {
    let raxBundles = getRaxBundles();
    // watch demo changes
    if (command === 'start') {
      const demoWatcher = chokidar.watch(demoDir, {
        ignoreInitial: false,
        interval: 200,
      });
      demoWatcher.on('all', () => {
        // re-generate entry files when demo changes
        raxBundles = getRaxBundles();
      });
      demoWatcher.on('error', (error) => {
        log.error('fail to watch demo', error);
      });
    }
    if (raxBundles) {
      entries = raxBundles.entries;
      serverBundles = raxBundles.serverBundles;
      herboxEntries = raxBundles.herboxEntries;
      const demoConfig = getDemoConfig(context, { ...compileOptions, entries, demos });
      registerTask('component-demo', demoConfig);
    }
  }
  // task name rule `component-build-${target}`.
  // plugins depend on task names, change task name rule will cause break change.
  if (command === 'start' && !watchDist) {
    targets.forEach((target) => {
      const options = { ...compileOptions, target, inlineStyle };
      if ([WEB, WEEX, NODE].includes(target)) {
        // eslint-disable-next-line
        const configDev = require(`./configs/rax/${target}/dev`);
        const defaultConfig = getBaseWebpack(context, options);
        configDev(defaultConfig, context, { ...options, entries, serverBundles });
        registerTask(`component-build-${target}`, defaultConfig);
      }

      if ([MINIAPP, WECHAT_MINIPROGRAM].includes(target)) {
        options[target] = options[target] || {};
        addMiniappTargetParam(target, options[target]);
        const config = getMiniappConfig(context, target, options, onGetWebpackConfig);
        registerTask(`component-build-${target}`, config);

        if (isHerboxConfigExist) {
          Object.keys(herboxEntries).forEach((entryKey) => {
            const constCopy = getHerboxBase(context, target, options, onGetWebpackConfig, entryKey, herboxEntries[entryKey]);
            registerTask(`component-build-demo-${entryKey}`, constCopy);
          });
        }
      }
    });
  } else if (command === 'build' || watchDist) {
    // omitLib just for sfc2mp，not for developer
    const disableGenerateLib = userConfig[MINIAPP] && userConfig[MINIAPP].omitLib;

    // clean build results
    fse.removeSync(path.join(rootDir, 'lib'));
    fse.removeSync(path.join(rootDir, 'dist'));
    fse.removeSync(path.join(rootDir, 'build'));
    fse.removeSync(path.join(rootDir, 'es'));

    targets.forEach((target) => {
      const options = { ...userConfig, target, inlineStyle };
      if (target === WEB) {
        registerTask(`component-build-${target}`, getDistConfig(context, options));
        registerTask(`component-build-${target}-es6`, getES6Config(context, options));
        if (!disableUMD) {
          registerTask(`component-build-${target}-umd`, getUMDConfig(context, options));
        }
      } else if (target === WEEX) {
        const distConfig = getDistConfig(context, { ...options, inlineStyle: true, entryName: 'index-weex' });
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
  }

  if (watchDist) {
    // disable hot when watch dist file
    onGetWebpackConfig((config) => {
      config.devServer.hot(false);
    });
  }

  onHook('after.build.compile', async (args) => {
    buildCompileLog(args, targets, rootDir, userConfig);
    if (!skipDemo) {
      await modifyPkgHomePage(pkg, rootDir);
    }
  });

  onHook('after.start.compile', async (args) => {
    // TODO: 接入 herbox

    const devUrl = args.url;
    devCompileLog(args, devUrl, targets, entries, rootDir, { ...userConfig, watchDist });
  });

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
};

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
