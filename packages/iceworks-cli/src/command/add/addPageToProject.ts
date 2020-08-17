// TODO : auto add page into project
// import * as fse from 'fs-extra';
// import * as camelCase from 'camelcase';
// import * as path from 'path';
// import { TEMP_PATH } from '../../utils/constants';
// import log from '../../utils/log';


// export default async (options,destDir)=>{
//   const tempDir = TEMP_PATH;

//   await fse.ensureDir(tempDir);
//   try{
//     const pageDirPath = await addPage(options,destDir,tempDir);
//     await fse.remove(tempDir);
//     log.info('add block success, you can import and use block in your page code',pageDirPath);
//   }catch (err) {
//     fse.removeSync(tempDir);
//     throw err;
//   }
// } 
// async function addPage(options,destDir,tempDir){

//   // eslint-disable-next-line prefer-const
//   let { npmName, name: pageDirName } = options;
//   log.verbose('addPageToProject', options);
  
//   // download npm page
//   if(!pageDirName){
//     // https://github.com/alvinhui/example-for-iceworks-page-template
//     const name = npmName.split('/')[1] || npmName.split('/')[0];
//     pageDirName = camelCase(name,{pascalCase: true});
//   }
//   const pageDirPath = path.resolve(destDir,pageDirName);
// }