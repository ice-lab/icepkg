const path = require('path');
const fse = require('fs-extra');
const uniqueFilename = require('./uniqueFilename.js');
const fixedFilename = require('./fixedFilename.js');
const formatWinPath = require('../formatWinPath.cjs');

const DOCUSAURUS_DIR = '.docusaurus';

const getDemoFileInfo = ({ rootDir, code, lang, filepath, index }) => {
  const demoDir = path.join(rootDir, DOCUSAURUS_DIR, 'demos');
  fse.ensureDirSync(demoDir);
  const demoFilename = fixedFilename(filepath, rootDir, index) || uniqueFilename(code);
  const demoFilepath = formatWinPath(path.join(demoDir, `${demoFilename}.${lang}`));
  return { demoFilename, demoFilepath };
};

const getPageFileInfo = ({ rootDir, demoFilepath, demoFilename }) => {
  const pagesDir = path.join(rootDir, DOCUSAURUS_DIR, 'demo-pages');
  fse.ensureDirSync(pagesDir);
  const pageFilename = formatWinPath(path.join(pagesDir, `${demoFilename}.jsx`));
  const pageFileCode = `
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('${formatWinPath(demoFilepath)}').default;
        return <Demo />
      }}
    </BrowserOnly>
  )
}
`;
  return { pageFilename, pageFileCode };
};

module.exports = {
  getDemoFileInfo,
  getPageFileInfo,
};
