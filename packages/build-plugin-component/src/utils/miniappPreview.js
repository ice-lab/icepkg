const path = require('path');
const qrcode = require('qrcode');
const {
  runAlipayLocalBuild,
  EBuildMode,
  EPackageType,
  EBuildTarget,
} = require('@ali/minicode-compile');
const fs = require('fs');
const chalk = require('chalk');

function deleteFolder(filePath) {
  let files = [];
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`;
      const states = fs.statSync(nextFilePath);
      if (states.isDirectory()) {
        // recurse
        deleteFolder(nextFilePath);
      } else {
        // delete file
        fs.unlinkSync(nextFilePath);
      }
    });
    fs.rmdirSync(filePath);
  }
}

function cpFileSync(sourcePath, distPath) {
  const stat = fs.statSync(sourcePath);
  if (stat.isFile()) {
    fs.copyFileSync(sourcePath, distPath);
  }
}

function saveImg(schema, _path) {
  qrcode.toDataURL(schema, (err, url) => {
    const imgBuffer = Buffer.from(url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    if (err) {
      console.log('生成二维码失败: ', err);
    }
    fs.writeFile(_path, imgBuffer, e => {
      if (e) {
        console.log('写入文件失败: ', e);
      }
    });
  });
}

module.exports = async (cmd, rootDir) => {
  const projectDir = path.join(rootDir, './build/ali-miniapp');
  const distDir = path.join(rootDir, '.dist');
  deleteFolder(distDir);

  // 小程序推包
  const result = await runAlipayLocalBuild({
    appId: '2019011563019657',
    input: projectDir,
    output: distDir,
    buildMode: EBuildMode.BuildPush,
    buildTarget: EBuildTarget.Preview,
    packageType: EPackageType.Inspect,
    enableSync: true,
  });

  if (result.success) {
    if (cmd === 'build') {
      if (fs.existsSync(path.join(rootDir, './build'))) {
        cpFileSync(distDir + '/dist.tar', path.join(rootDir, './build/dist.tar'));
      } else {
        cpFileSync(distDir + '/dist.tar', path.join(rootDir, './dist/dist.tar'));
      }
    }
    saveImg(result.packageSchema, path.join(rootDir, './build/miniapp.png'));
  } else {
    console.error(result.errorMessage);
    console.error(chalk.red('请解决以上问题，再使用小程序预览功能！'));
  }
};
