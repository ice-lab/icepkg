const path = require('path');
const glob = require('glob');
const ejs = require('ejs');
const fse = require('fs-extra');
const util = require('util');
const prettier = require('prettier');

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
            return renderFile(filepath, data, log);
          })
        )
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

async function renderFile(filepath, data, log) {
  const asyncRenderFile = util.promisify(ejs.renderFile);
  try {
    if (/\.ejs$/.test(filepath)) {
      const content = await asyncRenderFile(filepath, data);
      const targetFilePath = filepath.replace(/\.ejs$/, '');
      const formattedContent = prettier.format(content, {filepath: targetFilePath});
      await fse.rename(filepath, targetFilePath);
      await fse.writeFile(targetFilePath, formattedContent);
    }
  } catch (err){
    log.error('RenderError', err);
    throw err;
  }
}

module.exports = async (sourceDir, targetDir, variables, log) => {
  await fse.ensureDir(targetDir);
  await fse.copy(sourceDir, targetDir);
  try {
    await ejsRenderDir(targetDir, variables, log);
  } catch (error) {
    log.error('Problems occurred during compilation', error);
  }
};
