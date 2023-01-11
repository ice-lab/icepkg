# Changelog

## 1.4.2

- [chore] update ts types
- [feat] support configure the `path` and `exclude` config to @docusaurus/plugin-content-docs
- [feat] support configure the `onBrokenLinks` of docusaurus config

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
