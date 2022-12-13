# Changelog

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
