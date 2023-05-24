# Changelog

## 1.5.7

### Patch Changes

- b90b394: fix: not transform node_modules packages

## 1.5.6

### Patch Changes

- 975b29d: upgrade @swc/core to 1.3.55 and expect use @swc/helpers@^0.5.0

## 1.5.5

### Patch Changes

- 8cd4c98: feat: support modify swc compile options
  feat: enable `externalHelpers` config by default
- 2b01e99: fix: can not parse jsx/js file
- d37267d: feat: add bundle.polyfill config
- c9c4d46: fix: some es2017 syntax is not compatible with safari 10.1

## 1.5.4

### Patch Changes

- e9a8a4b: chore: update fields in package.json
- b83a6da: feat: support create monorepo project
- 96a6400: fix: lose createElement module in rax component

## 1.5.3

### Patch Changes

- f2f17ed: feat: minify css bundle
- 35bf1ca: feat: support configure jsxRuntime
- 52ccdf5: feat: support UI or unit test

## 1.5.3-beta.0

### Patch Changes

- f2f17ed: feat: minify css bundle
- 35bf1ca: feat: support configure jsxRuntime
- 52ccdf5: feat: support UI or unit test

## 1.5.2

### Patch Changes

- 5ccb429: chore: add ICE_PKG_BUNDLE_OUTPUT_DIR to process.env for CI
- 061db4f: fix: jsx-plus syntax can't be used in rax components
- 5d43ab0: chore: remove dist cli option

## 1.5.2-beta.1

### Patch Changes

- chore: release beta version

## 1.5.2-beta.0

### Patch Changes

- 5ccb429: chore: add ICE_PKG_BUNDLE_OUTPUT_DIR to process.env for CI
- 061db4f: fix: jsx-plus syntax can't be used in rax components
- 5d43ab0: chore: remove dist cli option

## 1.5.1

### Patch Changes

- 58ea9c9: fix: minified code can not run in safari

## 1.5.0

### Minor Changes

- ee42155: feat: specify @ice/jsx-runtime as jsx importSource

### Patch Changes

- 171c1dd: chore: lock @swc/core version
- 6981cde: fix: transform code error with babel plugin
- 390fe97: fix: can't generate dts on Windows system
  fix: can't generate dts when save code in dev
- 606608f: fix: dependency will not be installed

## 1.5.0-beta.1

### Minor Changes

- 6f8ed24: feat: specify @ice/jsx-runtime as jsx importSource

### Patch Changes

- 171c1dd: chore: lock @swc/core version
- 6981cde: fix: transform code error with babel plugin
- 390fe97: fix: can't generate dts on Windows system
  fix: can't generate dts when save code in dev
- 606608f: fix: dependency will not be installed

## 1.5.0-beta.0

### Minor Changes

- 6f8ed24: feat: specify @ice/jsx-runtime as jsx importSource

## 1.4.1

### Patch Changes

- 9a81116: fix: some export types were removed in d.ts

## 1.4.0

- [fix] bump version of build-scripts@2.0.0
- [refactor] bundle and transform task
- [feat] support incremental build in development
- [fix] not generate d.mts type file
- [fix] alias path is not transform in d.ts file

## 1.3.0

- [feat] pass modules to `after.build.compile` callback
- [feat] support cjs bundle task
- [feat] support configure `alias` in plugin
- [feat] support configure `extensions` in plugin
- [feat] support configure `babelPlugins` in plugin
- [feat] support bundle analyzer
- [feat] support process assets in bundle mode
- [feat] support configure `externals` in plugin
- [feat] support bundle minify
- [feat] support configure postcss options
- [feat] add default value of `define` config
- [feat] support multi entry support for bundle mode
- [feat] support development to both outputs
- [feat] pretty console output and add dir info

## 1.2.1

- [fix] update engines in package.json

## 1.2.0

- [feat] support json in bundle task
- [fix] can't transform d.ts file
- [fix] error when generating types for js files
- [refactor] exit process is @swc/helpers is not installed

## 1.1.2

- [fix] alias not work in transform mode

## 1.1.1

- [fix] resolve @ice/pkg-plugin-component

## 1.1.0

- [feat] Remove built-in rpx support
- [feat] Change default value of bundle externals to false
- [feat] Switch runtime to classics when transforming jsx in bundle task
- [feat] Warn if transformed code contains @swc/helpers which has not been added to project dependencies
- [fix] ReportSize error if file content is empty string

## 1.0.0

- init
