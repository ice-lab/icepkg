const path = require('path');
const fs = require('fs-extra');
const { getWebpackConfig, getJestConfig } = require('build-scripts-config');
const openBrowser = require('react-dev-utils/openBrowser');
const chokidar = require('chokidar');
const getRightEntryExtname = require('./utils/getRightEntryExtname');
const { markdownParser } = require('./utils/markdownHelper');
const getDemoDir = require('./utils/getDemoDir');
const getDemos = require('./utils/getDemos');
const getReadme = require('./utils/getReadme');
const getUMDWebpack = require('./utils/getUMDWebpack');
const generateEntryJs = require('./utils/generateEntry');
const formatPathForWin = require('./utils/formatPathForWin');
const modifyPkgHomePage = require('./utils/modifyPkgHomePage');
const baseConfig = require('./configs/react/base');
const devConfig = require('./configs/react/dev');
const buildConfig = require('./configs/react/build');
const defaultUserConfig = require('./configs/userConfig');
const reactUserConfig = require('./configs/react/userConfig');

const babelCompiler = require('./compiler/babel');

module.exports = (
  { context, registerTask, registerCliOption, registerUserConfig, onGetWebpackConfig, onHook, log, onGetJestConfig }
) => {
  const { command, rootDir, pkg, commandArgs, userConfig } = context;
  const { plugins, ...compileOptions } = userConfig;
  const { library, demoTemplate = 'template-component-demo', basicComponents = [] } = compileOptions;
  function generateDemoEntry({ demoDir, entryPath, demoDataPath, demoDataFile }) {
    const demos = getDemos(path.join(rootDir, demoDir), markdownParser);
    const readme = getReadme(rootDir, markdownParser, log);
    const [templateName, templateProps] = Array.isArray(demoTemplate) ? demoTemplate : [demoTemplate];
    generateEntryJs({
      template: 'template.hbs',
      outputPath: entryPath,
      params: {
        readme: JSON.stringify(readme),
        demoDataFile,
        templateName,
        templateProps: JSON.stringify(templateProps || {}),
        demos: demos.map(demo => ({
          ...demo,
          filePath: formatPathForWin(demo.filePath),
        })),
      },
    });
    // wirte demo content
    fs.writeFileSync(demoDataPath, `const data = ${JSON.stringify(demos)};export default data;`);
  }

  /**
   * register task for demo
   */
  const mode = command === 'start' ? 'development' : 'production';
  const webpackConfig = getWebpackConfig(mode);

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
    };
    // get multi demos from demo dir
    const markdownDirs = fs.readdirSync(demoDir).filter((file) => fs.statSync(path.join(demoDir, file)).isDirectory());
    const searchDirs = markdownDirs && markdownDirs.length ? markdownDirs : [''];
    const demoDataPathMap = {};
    const entries = {};
    searchDirs.forEach((markdownDir) => {
      const demoKey = markdownDir || 'index';
      const demoDataFile = `${demoKey}-demos.js`;
      const demoDataPath = path.join(outputDir, demoDataFile);
      const entryPath = path.join(outputDir, `${demoKey}-entry.js`);
      demoDataPathMap[demoKey] = demoDataPath;
      entries[demoKey] = entryPath;
      generateDemoEntry({ demoDir: path.join(demoDir, markdownDir), demoDataPath, entryPath, demoDataFile });
    });
    params.demoDataPath = demoDataPathMap;
    params.entry = entries;

    if (command === 'start') {
      // watch demo changes
      const demoWatcher = chokidar.watch(demoDir, {
        ignoreInitial: true,
        interval: 200,
      });
      demoWatcher.on('all', () => {
        // re-generate entry files when demo changes
        generateDemoEntry({ demoDir, demoDataPath, entryPath });
      });

      demoWatcher.on('error', (error) => {
        log.error('fail to watch demo', error);
      });
    }

    onGetWebpackConfig(taskName, config => {
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
  if (extNames && library && command === 'build') {
    registerTask('component-dist', getUMDWebpack({ context, compileOptions, extNames, hasMain }));
  }

  // register cli options
  const cliOptions = ['watch', 'skip-demo'];
  registerCliOption(cliOptions.map((name) => ({
    name,
    commands: ['start', 'build'],
  })));

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
      babelCompiler(context, log, basicComponents, compileOptions, 'react');
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
    babelCompiler(context, log, basicComponents, compileOptions, 'react');
    if (!commandArgs.skipDemo) {
      await modifyPkgHomePage(pkg, rootDir);
    }
  });

  onHook('after.start.devServer', ({ url }) => {
    // do not open browser when restart dev
    if (!process.env.RESTART_DEV) openBrowser(url);
  });
};
