const fse = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');
const { REG_JS } = require('../configs/reg');

const getPkgJSON = (cwd, module) => {
  const pkgPath = path.join(cwd, 'node_modules', module, 'package.json');
  if (!fse.existsSync(pkgPath)) return {};
  const jsonString = fse.readFileSync(pkgPath, 'utf-8');
  return JSON.parse(jsonString);
};

const defaultDynamicImportLibraries = [
  'antd',
  '@alifd/next',
  '@alife/next',
  '@icedesign/base',
];

function analyzePackage(pkg, basicComponents) {
  // get dependencies from pakage.json
  const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;
  const libraryNames = [];
  if (basicComponents) {
    Object.keys({ ...dependencies, ...devDependencies, ...peerDependencies }).forEach((depName) => {
      // basic component: antd、@alifd/next、@alife/next、@icedesign/base
      if (
        [
          ...defaultDynamicImportLibraries,
          ...basicComponents,
        ].includes(depName)
      ) {
        libraryNames.push(depName);
      }
    });
  }
  return libraryNames;
}

function filterDeps({ deps, rootDir, basicComponents }) {
  return deps.filter((dep) => {
    // relative path
    if (/^\./.test(dep)) {
      return false;
    }
    let basicLibrary = [
      /@icedesign\/.*/,
      /^@icedesign\/base\/(lib|es)\/([^/]+)/,
      /@alife\/.*/,
      /^@alife\/next\/(lib|es)\/([^/]+)/,
      /@alifd\/.*/,
      /^@alifd\/next\/(lib|es)\/([^/]+)/,
      /@ali\/ice-.*/,
      /antd\/.*/,
    ];
    if (basicComponents) {
      basicComponents.forEach((component) => {
        basicLibrary.push(new RegExp(`${component}/.*`));
      });
    } else {
      // clear basicLibrary if set basicComponents to false
      basicLibrary = [];
    }
    const isBasicLibrary = basicLibrary.some((library) => {
      return library.test(dep);
    });

    if (isBasicLibrary) {
      return true;
    }

    const pkgJSON = getPkgJSON(rootDir, dep);
    if (pkgJSON && (pkgJSON.componentConfig || pkgJSON.stylePath)) {
      return true;
    }
    return false;
  });
}

function getFileContent(filepath) {
  try {
    return String(fse.readFileSync(filepath));
  } catch (err) {
    console.log('Can not open file ', filepath);
    return '';
  }
}

// analyze require()
function analyzeAST(code) {
  const result = [];
  const visitor = {
    CallExpression(nodePath) {
      const { callee, arguments: args } = nodePath.node;
      const isImportNode = (
        callee.type === 'Identifier' &&
        callee.name === 'require'
      ) || callee.type === 'Import';

      if (
        isImportNode &&
        args.length === 1 &&
        args[0].type === 'StringLiteral'
      ) {
        result.push(args[0].value);
      }
    },
    ImportDeclaration(nodePath) {
      result.push(nodePath.node.source.value);
    },
    ExportAllDeclaration(nodePath) {
      const { node } = nodePath;
      if (node.source) {
        result.push(node.source.value);
      }
    },
    ExportNamedDeclaration(nodePath) {
      const { node } = nodePath;
      if (node.source) {
        result.push(node.source.value);
      }
    },
  };
  babel.transformSync(code, {
    plugins: [{ visitor }],
  });

  return result;
}

function dedupe(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('[dedupe]: arr should be an array;');
  }
  const map = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    const key = arr[i];
    map[key] = true;
  }
  return Object.keys(map);
}

// require.resolve .jsx and .vue files
require.extensions['.jsx'] = require.extensions['.js'];
require.extensions['.vue'] = require.extensions['.js'];

function analyzeDependencies(entryFilePath, rootDir, basicComponents) {
  const tracedFiles = {};
  let result = [];
  function trace(filename) {
    // filter traceFiles and assets files
    if (tracedFiles[filename] || !REG_JS.test(filename)) {
      return;
    }
    tracedFiles[filename] = true;
    const fileContent = getFileContent(filename);
    const analyzeResult = dedupe(analyzeAST(fileContent));

    result = result.concat(analyzeResult);
    analyzeResult.forEach((module) => {
      if (/^\./.test(module)) {
        const modulePath = require.resolve(
          path.join(path.dirname(filename), module),
        );
        trace(modulePath);
      }
    });
  }
  trace(require.resolve(entryFilePath));
  const deps = dedupe(result);
  return filterDeps({ deps, rootDir, basicComponents });
}

module.exports = {
  analyzeDependencies,
  analyzePackage,
  defaultDynamicImportLibraries,
};
