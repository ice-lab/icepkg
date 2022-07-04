const path = require('path');
const fs = require('fs-extra');
const { getWebpackConfig, getJestConfig } = require('build-scripts-config');
const openBrowser = require('react-dev-utils/openBrowser');
const chokidar = require('chokidar');
const getRightEntryExtname = require('./utils/getRightEntryExtname');
const { markdownParser } = require('./utils/markdownHelper');
const getDemoDir = require('./utils/getDemoDir');
const getDemos = require('./utils/getDemos');
const getReactDocs = require('./utils/getReactDocs');
const getReadme = require('./utils/getReadme');
const getUMDWebpack = require('./utils/getUMDWebpack');
const generateEntryJs = require('./utils/generateEntry');
const formatPathForWin = require('./utils/formatPathForWin');
const modifyPkgHomePage = require('./utils/modifyPkgHomePage');
const htmlInjection = require('./utils/htmlInjection');
const baseConfig = require('./configs/react/base');
const devConfig = require('./configs/react/dev');
const buildConfig = require('./configs/react/build');
const defaultUserConfig = require('./configs/userConfig');
const reactUserConfig = require('./configs/react/userConfig');
const setDevLog = require('./utils/setDevLog');
const setSassStyleExpanded = require('./utils/setSassStyleExpanded');

const babelCompiler = require('./compiler/babel');

module.exports = ({
  context,
  registerTask,
  registerCliOption,
  registerUserConfig,
  onGetWebpackConfig,
  onHook,
  log,
  onGetJestConfig,
}) => {
  const { command, rootDir, pkg, commandArgs, userConfig } = context;
  const { plugins, ...compileOptions } = userConfig;
  const { library, demoTemplate = 'template-component-demo', disableGenerateStyle, docGenIncludes } = compileOptions;
  const { https } = commandArgs;

  // config htmlInjection for once
  if (userConfig.htmlInjection) {
    htmlInjection.configWebpack(userConfig.htmlInjection);
  }

  /**
   * register task for demo
   */
  const mode = command === 'start' ? 'development' : 'production';
  const webpackConfig = getWebpackConfig(mode);

  setSassStyleExpanded(webpackConfig);

  // get demo information
  const demoDir = getDemoDir(rootDir);
  const taskName = 'component-demo-web';
  if (demoDir && !commandArgs.skipDemo) {
    registerTask(taskName, webpackConfig);
    const outputDir = path.join(rootDir, 'node_modules', '_component_demo');
    fs.ensureDirSync(outputDir);

    const params = {
      rootDir,
      pkg,
      https,
      disableGenerateStyle,
    };

    const generateDemoEntry = () => {
      // get multi demos from demo dir
      const markdownDirs = fs
        .readdirSync(demoDir)
        .filter((file) => fs.statSync(path.join(demoDir, file)).isDirectory());
      const searchDirs = markdownDirs && markdownDirs.length ? markdownDirs : [''];
      const demoData = [];
      const readme = getReadme(rootDir, markdownParser, log);
      const reactDocs = getReactDocs(rootDir, docGenIncludes);
      searchDirs.forEach((markdownDir) => {
        const demoKey = markdownDir || 'index';
        const demos = getDemos(path.join(rootDir, demoDir, markdownDir), markdownParser, rootDir);
        demoData.push({
          demoKey,
          demos: demos.map((demo) => {
            return {
              ...demo,
              filePath: formatPathForWin(demo.filePath),
              demoKey,
            };
          }),
        });
      });
      const entryPath = path.join(outputDir, 'demo-entry.js');
      const demoDataFile = 'demos-data.js';
      const demoDataPath = path.join(outputDir, demoDataFile);
      const reactDocsFile = 'react-docs.js';
      const reactDocsPath = path.join(outputDir, reactDocsFile);
      const [templateName, templateProps] = Array.isArray(demoTemplate) ? demoTemplate : [demoTemplate];
      generateEntryJs({
        template: 'template.hbs',
        outputPath: entryPath,
        params: {
          readme: JSON.stringify(readme),
          demoDataFile,
          templateName,
          templateProps: JSON.stringify(templateProps || {}),
          demoData,
          reactDocsFile,
        },
      });
      // wirte demo content
      fs.writeFileSync(demoDataPath, `const data = ${JSON.stringify(demoData)};export default data;`);
      fs.writeFileSync(reactDocsPath, `const data = ${JSON.stringify(reactDocs)};export default data;`);
      params.entry = { index: entryPath };
    };

    generateDemoEntry();

    if (command === 'start') {
      // watch demo changes
      const demoWatcher = chokidar.watch(demoDir, {
        ignoreInitial: true,
        interval: 200,
      });
      demoWatcher.on('all', () => {
        // re-generate entry files when demo changes
        generateDemoEntry();
      });

      demoWatcher.on('error', (error) => {
        log.error('fail to watch demo', error);
      });

      // disable default stats
      process.env.DISABLE_STATS = true;
    }

    onGetWebpackConfig(taskName, (config) => {
      baseConfig(config, params);
      if (command === 'start') {
        // component dev
        devConfig(config, params);
      } else if (command === 'build') {
        // component build
        buildConfig(config, params);
      }
    });
  } else if (!demoDir) {
    log.info('Can not find demo folder for component development');
  }

  /**
   * # register task for production
   */
  // get the right index entry from the src folder
  const extNames = getRightEntryExtname(path.resolve(rootDir, 'src/'));
  let hasMain = false;
  if (fs.existsSync(path.join(rootDir, 'src', 'main.scss'))) {
    hasMain = true;
  }
  // pack the right entry files to dist
  if (extNames && library && (command === 'build' || commandArgs.watchDist)) {
    registerTask('component-dist', getUMDWebpack({ context, compileOptions, extNames, hasMain }));
  }

  // register cli options
  const cliOptions = ['watch', 'skip-demo', 'watch-dist', 'https', 'disable-open'];
  registerCliOption(
    cliOptions.map((name) => ({
      name,
      commands: ['start', 'build'],
    })),
  );

  // register user config
  registerUserConfig(defaultUserConfig.concat(reactUserConfig));

  if (commandArgs.watch) {
    const srcPath = path.join(rootDir, 'src');
    const watcher = chokidar.watch(srcPath, {
      ignoreInitial: true,
      interval: 1000,
    });
    watcher.on('change', (file) => {
      log.info(`${file} changed, start compile library.`);
      babelCompiler(context, {
        log,
        userOptions: compileOptions,
        type: 'react',
      });
    });

    watcher.on('error', (error) => {
      log.error('fail to watch file', error);
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

  const compilerHook = commandArgs.skipDemo || !demoDir ? 'before.build.load' : 'after.build.compile';
  onHook(compilerHook, async () => {
    /**
     * # generate es and lib by using babel.
     */
    babelCompiler(context, {
      log,
      userOptions: compileOptions,
      type: 'react',
    });

    if (!commandArgs.skipDemo) {
      await modifyPkgHomePage(pkg, rootDir);
    }
  });

  onHook('after.start.compile', async ({ urls, stats }) => {
    // 自定义 log 内容
    setDevLog({ log, context, urls, stats });
  });

  onHook('after.start.devServer', ({ url }) => {
    // do not open browser when restart dev
    if (!process.env.RESTART_DEV && !commandArgs.disableOpen) openBrowser(url);
  });
};
