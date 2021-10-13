const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const chokidar = require('chokidar');
const getJestConfig = require('rax-jest-config');
const { WEB, WEEX, MINIAPP, WECHAT_MINIPROGRAM, NODE, KRAKEN } = require('./constants');
const getMiniappConfig = require('./configs/rax/miniapp/getBase');
const getMiniappRuntimeConfig = require('./configs/rax/getRuntimeMiniappConfig');
const getBaseWebpack = require('./configs/rax/getBaseWebpack');
const getDistConfig = require('./configs/rax/getDistConfig');
const getUMDConfig = require('./configs/rax/getUMDConfig');
const getES6Config = require('./configs/rax/getES6Config');
const generateRaxEntry = require('./utils/generateRaxEntry');
const generateRuntimeDemoEntry = require('./utils/generateRuntimeDemoEntry');
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
const getReadme = require('./utils/getReadme');
const generateRaxDemo = require('./utils/generateRaxDemo');
const { setModulesInfo } = require('./utils/getPortalModules');

module.exports = ({
  registerTask,
  registerUserConfig,
  context,
  onHook,
  registerCliOption,
  onGetWebpackConfig,
  onGetJestConfig,
  modifyUserConfig,
  log,
  registerMethod,
  setValue,
}) => {
  const { rootDir, userConfig, command, pkg, commandArgs } = context;
  const { plugins, targets, disableUMD, inlineStyle = true, miniapp, ...compileOptions } = userConfig;
  if (!(targets && targets.length)) {
    console.error(
      chalk.red('build-plugin-component need to set targets, e.g. ["build-plugin-component", targets: ["web", "weex"]]'),
    );
    console.log();
    process.exit(1);
  }
  const { skipDemo, https } = commandArgs;
  const watchDist = commandArgs.watchDist || userConfig.watchDist;
  const isRuntimeMiniapp = targets.includes(MINIAPP) && miniapp && miniapp.buildType === 'runtime';

  // compatible with rax-seed
  modifyUserConfig('watchDist', !!watchDist);
  // register user config
  registerUserConfig(defaultUserConfig.concat(raxUserConfig));
  // disable demo when watch dist

  registerMethod('pluginComponentGetDemoDir', getDemoDir);
  registerMethod('pluginComponentGetDemos', getDemos);
  registerMethod('pluginComponentGetReadme', getReadme);
  registerMethod('pluginComponentGetMiniappRuntimeConfig', getMiniappRuntimeConfig);
  registerMethod('pluginComponentSetPortalModules', setModulesInfo);
  setValue('pluginComponentDir', __dirname);

  let entries = {};
  let serverBundles = {};
  let demos = [];

  // register cli options
  const cliOptions = ['watch-dist', '--skip-demo', 'https'];
  registerCliOption(
    cliOptions.map((name) => ({
      name,
      commands: ['start', 'build'],
    })),
  );
  const demoDir = getDemoDir(rootDir);
  const getRaxBundles = () => {
    if (demoDir) {
      demos = getDemos(path.join(rootDir, demoDir), markdownParser);
      if (demos && demos.length) {
        return generateRaxEntry(demos, rootDir, targets);
      }
    }
    return false;
  };

  let raxBundles = false;

  fse.emptyDirSync(path.join(rootDir, 'build'));

  if (!watchDist && !skipDemo) {
    raxBundles = getRaxBundles();
    // watch demo changes
    if (command === 'start') {
      const demoWatcher = chokidar.watch(demoDir, {
        ignoreInitial: false,
        interval: 200,
      });
      demoWatcher.on('all', () => {
        // re-generate entry files when demo changes
        raxBundles = getRaxBundles();
        isRuntimeMiniapp && generateRuntimeDemoEntry(demos, rootDir);
      });
      demoWatcher.on('error', (error) => {
        log.error('fail to watch demo', error);
      });
    }
    if (raxBundles) {
      entries = raxBundles.entries;
      serverBundles = raxBundles.serverBundles;
      const demoConfig = getDemoConfig(context, { ...compileOptions, entries, demos, inlineStyle });
      registerTask('component-demo', demoConfig);
    }
  }
  // task name rule `component-build-${target}`.
  // plugins depend on task names, change task name rule will cause break change.
  if (command === 'start' && !watchDist) {
    targets.forEach((target) => {
      const options = {
        ...compileOptions,
        target,
        inlineStyle,
        https,
      };
      if ([WEB, WEEX, NODE, KRAKEN].includes(target)) {
        // eslint-disable-next-line
        const configDev = require(`./configs/rax/${target}/dev`);
        const defaultConfig = getBaseWebpack(context, options);
        configDev(defaultConfig, context, { ...options, entries, serverBundles });
        registerTask(`component-build-${target}`, defaultConfig);
      }

      if ([MINIAPP, WECHAT_MINIPROGRAM].includes(target)) {
        if (isRuntimeMiniapp && target === MINIAPP) {
          const runtimeMiniappConfig = getMiniappRuntimeConfig(context, options);
          registerTask('component-build-runtime-miniapp', runtimeMiniappConfig);
        } else {
          options[target] = options[target] || {};
          addMiniappTargetParam(target, options[target]);
          const config = getMiniappConfig(context, target, options, onGetWebpackConfig);
          registerTask(`component-build-${target}`, config);
        }
      }
    });
  } else if (command === 'build' || watchDist) {
    // omitLib just for sfc2mp，not for developer
    const disableGenerateLib = userConfig[MINIAPP] && userConfig[MINIAPP].omitLib;

    // clean build results
    fse.removeSync(path.join(rootDir, 'lib'));
    fse.removeSync(path.join(rootDir, 'dist'));
    fse.removeSync(path.join(rootDir, 'es'));

    targets.forEach((target) => {
      const options = { ...userConfig, target, inlineStyle };

      if (target === WEB) {
        registerTask(`component-build-${target}`, getDistConfig(context, options));
        registerTask(`component-build-${target}-es6`, getES6Config(context, options));
        if (!disableUMD) {
          registerTask(`component-build-${target}-umd`, getUMDConfig(context, options));
        }
      }

      if (target === WEEX) {
        const distConfig = getDistConfig(context, { ...options, inlineStyle: true, entryName: 'index-weex' });
        registerTask('component-build-weex', distConfig);
      }

      if ((target === MINIAPP && !isRuntimeMiniapp) || target === WECHAT_MINIPROGRAM) {
        options[target] = options[target] || {};
        addMiniappTargetParam(target, options[target]);
        const config = getMiniappConfig(context, target, options, onGetWebpackConfig);
        registerTask(`component-build-${target}`, config);
      }
    });
    onHook('before.build.load', async () => {
      if (!disableGenerateLib) {
        babelCompiler(context, {
          log,
          userOptions: compileOptions,
          type: 'rax',
        });
      }
    });
  }

  if (watchDist) {
    // disable hot when watch dist file
    onGetWebpackConfig((config) => {
      config.devServer.hot(false);
    });
  }

  onHook(`before.${command}.run`, async () => {
    if (!skipDemo && !watchDist && raxBundles) {
      await generateRaxDemo(demos, context);
    }
  });

  onHook('after.build.compile', async (args) => {
    buildCompileLog(args, targets, rootDir, userConfig);
    if (!skipDemo) {
      await modifyPkgHomePage(pkg, rootDir);
    }
  });

  onHook('after.start.compile', async (args) => {
    devCompileLog(args, context, { ...userConfig, watchDist, entries });
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
