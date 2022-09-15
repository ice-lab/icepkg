# Changelog

## 1.12.0
- [feat] Add bytedance microapp support 

## 1.11.0

- [feat] Support docGenIncludes for all *.md files in demo([#285](https://github.com/ice-lab/iceworks-cli/issues/250)))
- [fix] disable minimize sass output by default. ([#250](https://github.com/ice-lab/iceworks-cli/issues/250))

## 1.10.0

- [feat] support docgen.[#253](https://github.com/ice-lab/icepkg/pull/263)
- [feat] support using --disable-open command to disable opening the browser automatically[#265](https://github.com/ice-lab/icepkg/pull/265)
- [feat] upgrade build-plugin-component-screenshot version

## 1.9.4

- [fix] styles will missing in style.js if React.lazy is used，where dynamic import is ignored by ASTParser ([#260](https://github.com/ice-lab/iceworks-cli/pull/260))

```
var PlatformMap = {
  mobile: /*#__PURE__*/React.lazy(function () {
    return import('./mobile');
  })
};
```

- [fix] use babel-plugin-import transform `import { Foo } from 'package'` consider `esm/` libraryDirectory, for `@formily/next-components`
- [chore] use `require.resolve` transform babel plugins path

## 1.9.3

- [feat] add default cors handler.


## 1.9.2

- [feat] `generateTypesForJs` to support compile `.d.ts` for JavaScript who uses jsdoc.
- [fix] compile error may occur when compile `.d.ts` for JavaScript. ([#246](https://github.com/ice-lab/iceworks-cli/issues/246))

## 1.9.1

- [chore] upgrade ice-npm-utils from 1.x to 3.x

## 1.9.0

- [feat] upgrade `build-scripts-config` to 3.x.
- [fix] compatible with mini-css-extract-plugin 1.x.
- [fix] avoid wrong result when compiling `Class` with babel.

## 1.8.2

- [chore] update miniapp-compile-config version to 0.2.x

## 1.8.1

- [feat] support babelPlugins in `type: rax`.
- [fix] provide consistency of `define` between rax & react ([#235](https://github.com/ice-lab/iceworks-cli/issues/235))

## 1.8.0

- [feat] use `disableGenerateStyle` to bypass `style.js` ([#4705](https://github.com/alibaba/ice/issues/4705))

## 1.7.0

- [feat] support `https` cli option
- [feat] support `define` user config option
- [fix] generate .d.ts files for win32

## 1.6.6

- [hotfix] 修复 inlineStyle 默认为 true 这一行为逻辑的 break change ([#214](https://github.com/ice-lab/iceworks-cli/issues/214))

## 1.6.5

- [fix] 修复 inlineStyle 为 false 时，不支持引入多份 css 文件 ([#199](https://github.com/ice-lab/iceworks-cli/issues/199))
- [feat] 兼容 build-scripts 1.x

## 1.6.4

- [fix] 修复 win32 路径问题

## 1.6.3

- [feat] 支持 O2 IDE 开发调试

## 1.6.2

- [fix] 修复 external 下包错误引入的问题 ([#180](https://github.com/ice-lab/iceworks-cli/issues/180))

## 1.6.1

- [fix] 修复 lerna 包下 `style.js` 内容缺失
## 1.6.0

- [feat] Rax demos 支持注入自定义内容 ([#157](https://github.com/ice-lab/iceworks-cli/issues/157))
- [fix] 优化 react 组件分包下 external 的规则 ([#153](https://github.com/ice-lab/iceworks-cli/issues/153))
- [fix] 修复 demo 文件中，`$` 未被转义 ([#159](https://github.com/ice-lab/iceworks-cli/pull/159))

## 1.5.0

- [feat] 支持 rax 运行时小程序预览 ([#121](https://github.com/ice-lab/iceworks-cli/issues/121))

## 1.4.0

- [feat] 支持开发时构建 Kraken 产物 ([#142](https://github.com/ice-lab/iceworks-cli/issues/142))
- [feat] 升级 makedown parser 至 2.x ([#136](https://github.com/ice-lab/iceworks-cli/issues/136))
- [fix] pkg.name alias 精确匹配 ([#145](https://github.com/ice-lab/iceworks-cli/issues/145))

## 1.3.4

- [feat] 支持 react 组件 watchDist ([#120](https://github.com/ice-lab/iceworks-cli/issues/120))
- [feat] 支持小程序跨端使用不同的后缀的类型文件
- [feat] 支持 css module
- [fix] 修复 rax 组件 demo 使用 rax-portal 报错 ([#110](https://github.com/ice-lab/iceworks-cli/issues/110))
- [fix] 修复 yaml 升级 v4 导致 api 变更 ([#116](https://github.com/ice-lab/iceworks-cli/issues/116))

## 1.3.0

- [feat] 支持小程序预览 ([#66](https://github.com/ice-lab/iceworks-cli/issues/66), [#53](https://github.com/ice-lab/iceworks-cli/issues/53))
- [feat] 修改 demo 样式
- [fix] 修复 inlineStyle 为 false 下，同步到 Fusion 物料样式失效

## 0.2.22

- [fix] fix invalid homepage

## 0.2.21

- [feat] support custom unpkgHost

## 0.2.20

- [fix] fail to create component-demos.js when no node_modules folder

## 0.2.19

- [fix] export declaration analyzation
- [fix] check style statement before import

## 0.2.18

- [fix] support modify babel options
- [fix] reorder style import statement of component
- [fix] ignore node_modules in folder src

## 0.2.17

- [feat] support demoTemplate to specify demo style
- [feat] support remove basicComponents
- [feat] support babelPlugins in basic config

## 0.2.16

- [feat] support `<DemoCode src="path/to/code.js" />` to display demo code
- [fix] error render cause by mulit version of react-router-dom
- [fix] ast parse error
- [fix] update demo style
- [refactor] migrate options to basic config

## 0.2.15

- [fix] compatible with markdown filename with dashed
- [fix] log diagnostics of ts emit result
- [feat] update demo style
- [feat] refactor dist build, support sourceMap, minify

## 0.2.14

- [fix] lock core-js version
- [feat] support option babelPlugins

## 0.2.13

- [hotfix] add css entry before js

## 0.2.12

- [fix] error when add style entry

## 0.2.11

- [fix] umd compile without style file

## 0.2.10

- [fix] add polyfill for component demo

## 0.2.9

- [fix] filter module when analyze depenencies

## 0.2.8

- [fix] add plugins for demo parse

## 0.2.7

- [feat] speed up compilation of declaration
- [fix] disable host check of devserver
- [fix] watch demo changes

## 0.2.6

- [feat] jest config for component development

## 0.2.5

- [fix] compatible with React 15.x

## 0.2.4

- [fix] regex for babel-loader

## 0.2.2

- [feat] support different demo in mode dev and build
- [feat] support cli options `--watch` and `--skip-demo`
- [feat] modify homepage after build

## 0.2.1
- [feat] support to generate DTS files for TS

## 0.2.0

- [feat] brand new demo for component development
- [feat] remove rax compile, rax component development will support in build-plugin-rax-component
- [feat] support option basicComponents for basic component dependent

## 0.1.5

- [fix] support target wechat-miniprogram

## 0.1.4

- [fix] add export type for packing library
- [fix] fix entry order

## 0.1.3

- [fix] ignore css files when analyze file dependenices

## 0.1.2

- [fix] compatible with demo and package info
- [fix] analyze dependencies by babel AST

## 0.1.1

- [fix] add webpack extension
