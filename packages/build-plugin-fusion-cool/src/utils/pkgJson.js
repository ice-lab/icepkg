const path = require('path');
const fs = require('fs');

/**
 * @description get json content form package.json
 * @param   {String} cwd
 * @returns {Object} pkgJSON content
 */
function getPkgJSONSync(cwd) {
  const pkgJSONPath = path.join(cwd, './package.json');
  return getJSONSync(pkgJSONPath);
}

/**
 * @description get content of json file
 * @param   {String} jsonPath
 * @returns {Object} json content
 */
function getJSONSync(jsonPath) {
  const jsonString = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(jsonString);
}

/**
 * @description write json content to package.json
 * @param {Object} pkg
 * @param {String} cwd
 */
function writePkgJSON(pkg, cwd) {
  const pkgJSONPath = path.join(cwd, './package.json');
  writeJSON(pkg, pkgJSONPath);
}

/**
 * @description write content to json file
 * @param {Object} obj jsonObject
 * @param {String} jsonPath jsonFilePath
 */
function writeJSON(obj, jsonPath) {
  const jsonString = JSON.stringify(obj, null, 2);
  fs.writeFileSync(jsonPath, jsonString, 'utf-8');
}

module.exports = {
  getPkgJSONSync,
  writePkgJSON,
  getJSONSync,
  writeJSON,
};
