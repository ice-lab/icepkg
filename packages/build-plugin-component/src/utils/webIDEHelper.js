const isWebIDE = !!process.env.CLOUDIDE_ENV;

function getWebIDEDevUrl(port) {
  return `https://${process.env.WORKSPACE_UUID}-${port}.${process.env.WORKSPACE_HOST}/`;
}

module.exports = {
  isWebIDE,
  getWebIDEDevUrl,
};
