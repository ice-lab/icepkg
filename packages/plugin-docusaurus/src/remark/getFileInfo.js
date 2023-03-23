const path = require('path');
const fse = require('fs-extra');
const uniqueFilename = require('./uniqueFilename.js');

const DOCUSAURUS_DIR = '.docusaurus';

const getDemoFileInfo = ({ rootDir, code, lang }) => {
  const demoDir = path.join(rootDir, DOCUSAURUS_DIR, 'demos');
  fse.ensureDirSync(demoDir);
  const demoFilename = uniqueFilename(code);
  const demoFilepath = path.join(demoDir, `${demoFilename}.${lang}`);
  return { demoFilename, demoFilepath };
};

const getPageFileInfo = ({ rootDir, demoFilepath, demoFilename }) => {
  const pagesDir = path.join(rootDir, DOCUSAURUS_DIR, 'demo-pages');
  fse.ensureDirSync(pagesDir);
  const pageFilename = path.join(pagesDir, `${demoFilename}.jsx`);
  const pageFileCode = `
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('${demoFilepath}').default;
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
