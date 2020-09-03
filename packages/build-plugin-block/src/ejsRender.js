const path = require('path');
const glob = require('glob');
const ejs = require('ejs');
const fse = require('fs-extra');
const util = require('util');

const ejsRenderDir = async function (dir, data, log) {
  return new Promise((resolve, reject) => {
    glob(
      '**',
      {
        cwd: dir,
        ignore: ['node_modules/**'],
        nodir: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(
          files.map((file) => {
            const filepath = path.join(dir, file);
            return ejsRenderFile(filepath, data, log);
          })
        )
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

async function ejsRenderFile(filepath, data, log) {
  const asyncRenderFile = util.promisify(ejs.renderFile);
  try {
    if (/\.ejs$/.test(filepath)) {
      const content = await asyncRenderFile(filepath, data);
      const targetFilePath = filepath.replace(/\.ejs$/, '');
      await fse.rename(filepath, targetFilePath);
      await fse.writeFile(targetFilePath, content);
    }
  } catch (err){
    log.error('RenderError', err);
    throw err;
  }
}

module.exports = async (sourcePath, targetPath, variables, log) => {
  try {
    // 如果渲染文件时存在同名的文件夹，则会阻塞渲染，应该删除。
    fse.remove(targetPath);
    const stat = await fse.stat(sourcePath);
    if(stat.isDirectory()) {
      await fse.ensureDir(targetPath);
      await fse.copy(sourcePath, targetPath);
      await ejsRenderDir(targetPath, variables, log);
    } else {
      await fse.ensureFile(targetPath);
      await fse.copy(sourcePath, targetPath);
      await ejsRenderFile(targetPath, variables, log);
    }
  } catch (error) {
    log.error('Problems occurred during compilation', error);
  }
};
