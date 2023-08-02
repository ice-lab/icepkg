# Changelog

## 1.4.15

### Patch Changes

- 24879fe: feat: use real local path instead of hash to generate demo path

## 1.4.14

### Patch Changes

- 3c99945: fix: Doc build failed in windows

## 1.4.13

### Patch Changes

- fix: symlink error when dir doesn't exist

## 1.4.12

### Patch Changes

- 26acc19: fix: not resolve package in docs
- eca090d: feat: add specified host for development server

## 1.4.11

### Patch Changes

- a02a27d: fix: react package.json in root dir

## 1.4.10

### Patch Changes

- 4b81cc1: fix: OOM when use tnpm/cnpm to install dependencies

## 1.4.9

### Patch Changes

- be0bfdf: fix: not generate demo pages in monorepo
- 7f37d7f: chore: upgrade @swc/helpers version to ^0.5.1

## 1.4.8

### Patch Changes

- e600d33: fix: mobile preview style

## 1.4.7

### Patch Changes

- 58a7b87: fix: can not render two components in one mdx file
- 7f63497: feat: support add remark plugins

## 1.4.6

### Patch Changes

- af07864: fix: rpx2vw is invalid in less and scss

## 1.4.5

### Patch Changes

- 73898e0: fix: sass-loader and less-loader can't be resolved
- e9a8a4b: chore: update fields in package.json
- 6ac1c8c: feat: add slash after url to avoid redirect

## 1.4.4

### Patch Changes

- cf3af78: fix: can not resolve docusaurus/plugin-contents-page

## 1.4.4-beta.1

### Patch Changes

- chore: release beta version

## 1.4.4-beta.0

### Patch Changes

- cf3af78: fix: can not resolve docusaurus/plugin-contents-page

## 1.4.3

### Patch Changes

- 6f9404d: feat: support configure docusaurus plugin 9f1100c2
- ee42155: feat: add @ice/jsx-runtime as dependency

## 1.4.3-beta.3

### Patch Changes

- 6f9404d: feat: support configure docusaurus plugin 9f1100c2
- 6f8ed24: feat: add @ice/jsx-runtime as dependency

## 1.4.3-beta.2

### Patch Changes

- 6f8ed24: feat: add @ice/jsx-runtime as dependency

## 1.4.2

### Patch Changes

- a6b7a26: fix: fail to render two previewer
- 9a81116: - chore update ts types
  - feat support configure the `path` and `exclude` config to @docusaurus/plugin-content-docs
  - feat support configure the `onBrokenLinks` of docusaurus config

## 1.4.1

- [feat] support configure docusaurus outputDir
- [feat] enable `lessOptions.javascriptEnabled = true` options to support antd component
- [fix] can resolve `exports` in package.json

## 1.4.0

- [feat] support scan qrcode at mobile preview
- [feat] support external ip access at start stage
- [fix] can't generate demo pages in build command if mobilePreview is turned on
- [fix] can't use short syntax (<></>) of fragment
- [refactor] set default locales to zh-Hans
- [refctor] remove browser only import

## 1.3.2

- [fix] react resolve error in npm

## 1.3.1

- [fix] miss sass dependency
- [refactor] exit preview sub process is @swc/helpers is not installed
- [fix] error if rax-compat is not installed

## 1.3.0

- [feat] support using rpx in sass and less

## 1.2.0

- [feat] Add enable config to control doc build
- [feat] support less
- [feat] support using BrowserOnly for components that only works in browsers
- [refactor] use @ice/pkg to build package

## 1.1.1

- [fix] resolve `style-unit`. (#372)(https://github.com/ice-lab/icepkg/issues/372)

## 1.1.0

- [feat] support rpx use in demo preview
- [feat] resolve project rax-compat dependency

## 1.0.0

- init
