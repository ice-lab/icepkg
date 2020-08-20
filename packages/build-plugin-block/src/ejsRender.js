const fse = require('fs-extra');
const originEjsRenderDir = require('./ejsRenderDir');

module.exports = async (sourceDir,targetDir,variables,log)=>{
  fse.ensureDir(targetDir);
  fse.copySync(sourceDir,targetDir);
  try{
    await originEjsRenderDir(targetDir,variables).then();
  }catch(error){
    log.error('Problems occurred during compilation',error)
  }

}

