const { createHash } = require('crypto');

const DEMO_PREFIX = 'IcePkgDemo';

/** Use the md5 value of docPath */
const uniqueFilename = (originalDocPath) => {
  const hash = createHash('md5');
  hash.update(originalDocPath);
  const hashValue = hash.digest('hex');

  return `${DEMO_PREFIX}_${hashValue.slice(0, 6)}`;
};

module.exports = uniqueFilename;
