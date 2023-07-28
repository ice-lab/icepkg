const DEMO_PREFIX = 'IcePkgDemo';

/** Use docPath */
const fixedFilename = (filepath, rootDir) => {
  try {
    const componentName = filepath.replaceAll(rootDir, '').replace(/\.mdx?$/, '');
    return `${DEMO_PREFIX}${componentName}`.replace(/[/\\-]/g, '_');
  } catch (e) {
    return '';
  }
};

module.exports = fixedFilename;
