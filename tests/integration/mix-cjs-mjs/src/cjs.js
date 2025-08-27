module.exports.add = function (a, b) {
  return a + b;
};

module.exports.extend = function (a, b) {
  return { ...a, ...b };
};
