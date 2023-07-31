const DEMO_PREFIX = 'IcePkgDemo';

/** Use docPath */
const fixedFilename = (filepath, rootDir, index) => {
  try {
    const componentName = filepath.replace(rootDir, '').replace(/\.mdx?$/, '');
    return `${DEMO_PREFIX}${componentName}_${index}`.replace(/[/\\-]/g, '_');
  } catch (e) {
    return '';
  }
};

module.exports = fixedFilename;
