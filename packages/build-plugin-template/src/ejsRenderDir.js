const path = require('path');
const glob = require('glob');
const ejs = require('ejs');
const fse = require('fs-extra');

module.exports = async function(dir ,options) {
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: dir,
      ignore: ['node_modules/**'],
      nodir: true,
      dot: true,
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      Promise.all(files.map((file) => {
        const filepath = path.join(dir, file);
        return renderFile(filepath, options);
      })).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

function renderFile(filepath, options){
  let filename = path.basename(filepath);

  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (/\.ejs$/.test(filepath)) {
        filename = filename.replace(/\.ejs$/, '');
        fse.removeSync(filepath);
      }

      const newFilepath = path.join(filepath, '../', filename);
      fse.writeFileSync(newFilepath, result);
      resolve(newFilepath);
    });
  });
}
