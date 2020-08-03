# Changelog

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