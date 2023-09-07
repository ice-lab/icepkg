module.exports = function formatWinPath(path: string) {
  return path.replace(/\\/g, '\\\\');
};
