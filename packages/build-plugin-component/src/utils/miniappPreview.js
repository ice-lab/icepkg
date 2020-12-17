const path = require('path');
const ip = require('ip');
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

async function saveMiniappQrcode(rootDir, command, name) {
  const projectDir = path.join(rootDir, `./build/mini-program-demos/rax-herbox-${name}`);
  const distDir = path.join(rootDir, `./.dist/${name}`);
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
    saveImg(result.packageSchema, path.join(rootDir, `./build/${name}-miniapp.png`));
  } else {
    console.error(result.errorMessage);
    console.error(chalk.red('请解决以上问题，再使用小程序预览功能！'));
  }
}

function saveWebQrcode(rootDir, command, name, devUrl) {
  const _devUrl = devUrl.replace('localhost', ip.address());
  const url = `${_devUrl}${name}`;
  saveImg(url, path.join(rootDir, `./build/${name}-web.png`));
}

module.exports = async (rootDir, command, demos, devUrl) => {
  demos.forEach(demo => {
    saveMiniappQrcode(rootDir, command, demo.filename);
    saveWebQrcode(rootDir, command, demo.filename, devUrl);
  })
};
