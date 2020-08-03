const path = require('path');
const fs = require('fs');
const screenShot = require('./utils/screenShot');

// Update package.json
const updatePackageJson = (packageJsonPath, type, htmls, screenshots) => {
  const jsonData = fs.readFileSync(packageJsonPath, 'utf8');
  const jsonObj = JSON.parse(jsonData);
  for (let i = 0; i < htmls.length; i++) {
    jsonObj[type].views[i].html = htmls[i];
    jsonObj[type].views[i].screenshot = screenshots[i];
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(jsonObj, null, '  '));
};

module.exports = ({
  modifyUserConfig,
  context,
  onHook,
  registerCliOption,
}) => {
  // modify default outputAssetsPath
  modifyUserConfig('outputAssetsPath', { js: '', css: ''});

  // 仅在执行 tnpm run build --design (实际在区块上大多数是 tnpm run build -- --design)时生效
  // 开始为生成的 build/views/ 文件下的html文件内容，添加 data-fusioncool 信息
  registerCliOption({
    name: 'design', // 注册的 cli 参数名称，
    commands: ['build'],  // 支持的命令，如果为空默认任何命令都将执行注册方法
    configWebpack: (config) => {
      config.module
      .rule('fusion-cool-loader')
      .test(/\.(jsx|tsx)$/i)
      .use('fusion-cool')
      .loader(require.resolve('./utils/fusionCoolInfoLoader'));
    },
  });

  // after the build script finished
  onHook('after.build.compile', async () => {
    // get package.json and rootDir
    const { pkg, rootDir } = context;
    const packageJsonPath = path.join(rootDir, 'package.json');
    const outputRootPath = path.join(rootDir, 'build', 'views');
    fs.mkdirSync(outputRootPath);
    // get htmls and screenshots if blockConfig.views or scaffoldConfig.views exist
    const htmls = [];
    const screenshots = [];
    if (pkg.blockConfig && pkg.blockConfig.views) {
      // block type
      screenShot({
        packageJsonPath,
        serverPath: rootDir,
        targetUrl: '/build/index.html',
        imgOutput: './build/views/block_view1.png',
        htmlOutput: './build/views/block_view1.html',
      });
      updatePackageJson(packageJsonPath, 'blockConfig', ['build/views/block_view1.html'], ['build/views/block_view1.png']);
    }
    else if (pkg.scaffoldConfig && pkg.scaffoldConfig.views) {
      // scaffold type
      for (let i = 0; i < pkg.scaffoldConfig.views.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await screenShot({
          packageJsonPath,
          serverPath: path.join(rootDir, 'build'),
          imgOutput: `./build/views/page${i}.png`,
          htmlOutput: `./build/views/page${i}.html`,
          routePath: pkg.scaffoldConfig.views[i].path,
        });
        htmls.push(`build/views/page${i}.html`);
        screenshots.push(`build/views/page${i}.png`);
      }
      updatePackageJson(packageJsonPath, 'scaffoldConfig', htmls, screenshots);
    }
  });
};
