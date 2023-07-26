const DEMO_PREFIX = 'IcePkgDemo';

/** Use docPath */
const fixedFilename = (filepath) => {
  const componentNameMatch = /\/packages\/(.*?)\.(md|mdx)/g.exec(filepath);
  const componentName = componentNameMatch && componentNameMatch[1];
  return `${DEMO_PREFIX}_${componentName}`.replaceAll('/', '-').replaceAll('-', '_');
};

module.exports = fixedFilename;
