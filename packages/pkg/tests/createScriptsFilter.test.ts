import { describe, test, expect } from 'vitest';
import { createScriptsFilter, getIncludeNodeModuleScripts } from '../src/utils';

test('default createScriptsFilter', async () => {
  const scriptsFilter = createScriptsFilter();
  // The path /w is workspace root
  expect(scriptsFilter('/w/src/a.js')).toBe(true);
  expect(scriptsFilter('/w/src/a/b.js')).toBe(true);
  expect(scriptsFilter('/w/cov/a.js')).toBe(true);

  // Windows path
  expect(scriptsFilter('C:\\w\\src\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\src\\a\\b.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\cov\\a.js')).toBe(true);

  // default exclude node_modules files
  expect(scriptsFilter('/w/node_modules/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/src/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(false);
  // default exclude d.ts
  expect(scriptsFilter('/w/src/a.d.ts')).toBe(false);
  // default exclude some deps
  expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);
})

test('createScriptsFilter with compileDependencies true', async () => {
  const scriptsFilter = createScriptsFilter(getIncludeNodeModuleScripts(true));
  // The path /w is workspace root

  // exclude node_modules files
  expect(scriptsFilter('/w/node_modules/lodash/a.js')).toBe(true);
  expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(true);

  // Windows path
  expect(scriptsFilter('C:\\w\\node_modules\\lodash\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\a.js')).toBe(true);

  // default exclude some deps
  expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);

})

test('createScriptsFilter with some compileDependencies', async () => {
  const scriptsFilter = createScriptsFilter(getIncludeNodeModuleScripts(['lodash', '@ice/app']));

  // The path /w is workspace root

  // exclude node_modules files
  expect(scriptsFilter('/w/node_modules/lodash/a.js')).toBe(true);
  expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(true);
  expect(scriptsFilter('/w/node_modules/@ice/runtime/node_modules/lodash/a.js')).toBe(true);
  expect(scriptsFilter('/w/node_modules/@ice/runtime/node_modules/@ice/app/a.js')).toBe(true);
  expect(scriptsFilter('/w/node_modules/@ice/app/node_modules/rax-compat/index.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/lodash/node_modules/rax-compat/index.js')).toBe(false);
  // Windows path
  expect(scriptsFilter('C:\\w\\node_modules\\lodash\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\node_modules\\@ice\\runtime\\node_modules\\lodash\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\node_modules\\@ice\\runtime\\node_modules\\@ice\\app\\a.js')).toBe(true);
  expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\node_modules\\rax-compat\\index.js')).toBe(false);

  // default exclude some deps
  expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
  expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);
})
