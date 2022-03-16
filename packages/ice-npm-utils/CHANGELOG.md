# Changelog

## 3.0.2

- [fix] compareFunction of Array.sort should not returns boolean value. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description

## 3.0.1

- [feat] optimize checkAliInternal

## 3.0.0

- [chore] change cnpm registry to `registry.npmmirror.com`
- [chore] migrate request to axios, notice `error.statusCode` -> `error.response && error.response.status === 404`
- [chore] upgrade deps:
  - fs-extra 8 -> 10, Only support Node.js 12+
  - mkdirp 0.5.x -> 1.x
  - semver 6.x -> 7.x
  - tar 0.4.x -> 0.6.x

## 2.1.2

- [chore] remove `@iceworks/constant`, use `@appworks/constant`

## 2.1.1

- [chore] better error message

## 2.1.0

- [feat] add `getVersions` and `getSatisfiesVersions` method

## 1.4.1

- [chore] remove cacheData for server use

## 1.3.1

- [feat] isAliNpm add `@kaola`

## 1.3.0

- [feat] getNpmRegistry remove npmconf and default `https://registry.npm.taobao.org`

## 1.2.0

- [feat] getNpmRegistry 优先读取 npm config，否则返回 `https://registry.npm.com`
- [fix] extract tarball consider directory

## 1.1.2

- [fix] 修复getAndExtractTarball写空文件时卡死的问题

## 1.1.1

- [fix] 用 request-promise 替换 axios 之后的参数变化

## 1.1.0

- [feat] 新增 getAndExtractTarball&getNpmTarball 两个 API
- [chore] 请求库从 axios 统一为 request

## 1.0.3

- [chore] 增加 log
- [fix] checkInternal timeout 延长到 3s

## 1.0.2

- init
