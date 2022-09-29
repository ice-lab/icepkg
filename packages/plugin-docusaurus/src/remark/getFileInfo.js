const path = require('path');
const fse = require('fs-extra');
const uniqueFilename = require('./uniqueFilename.js');

const DOCUSAURUS_DIR = '.docusaurus';

const getDemoFileInfo = ({ rootDir, filepath, lang }) => {
  const demoDir = path.join(rootDir, DOCUSAURUS_DIR, 'demos');
  fse.ensureDirSync(demoDir);
  const demoFilename = uniqueFilename(filepath);
  const demoFilepath = path.join(demoDir, `${demoFilename}.${lang}`);
  return { demoFilename, demoFilepath };
};

const getPageFileInfo = ({ rootDir, demoFilepath, demoFilename }) => {
  const pagesDir = path.join(rootDir, DOCUSAURUS_DIR, 'pages');
  fse.ensureDirSync(pagesDir);
  const pageFilename = path.join(pagesDir, `${demoFilename}.jsx`);
  const pageFileCode = `
  import Demo from '${demoFilepath}';
  export default Demo;
`;
  return { pageFilename, pageFileCode };
};

module.exports = {
  getDemoFileInfo,
  getPageFileInfo,
};
