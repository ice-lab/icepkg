# 发布

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 配置产物信息

### files

发布之前需要确认需要发布哪些文件到 npm 上。比如，现在通过 build 后生成了 `esm` 和 `es2017` 产物，我们需要把它们加到 `package.json` 中：

```diff
{
  "files": [
    ...
+   "esm",
+   "es2017"
  ]
}
```

默认情况下，`package.json`、`README`、`LICENSE` 等文件是默认被发布上去的；一些临时目录和 `node_modules` 目录在发布时默认是不带上去的。更多详情可参考 [NPM 文档](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files)。

### main & exports

推荐在 `package.json` 中配置 `exports` 字段来声明 npm 包的入口：

```json
{
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js",
      "es2017": "./es2017/index.js",
      "default": "./cjs/index.js"
    },
    "./feature": {
      "import": "./esm/feature.js",
      "require": "./cjs/feature.js",
      "es2017": "./es2017/feature.js",
      "default": "./cjs/feature.js"
    }
  }
}
```

这样我们就可以通过以下的方式分别导入对应的模块了：

```js
import Module1 from 'your-package-name';
import feature from 'your-package-name/feature';
```

:::tip
关于更多 `package.exports` 导出规则，可以查看 [Node.js 文档](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points)。
:::

如果需要兼容 v12.20.0 或者 v14.13.0 以下的 Node.js，那就需要在 `package.json` 里的 `main` 字段指定主入口：

```json
{
  "main": "./esm/index.js"
}
```

> 注意：exports 优先级比 main 优先级高，所以如果需要兼容低版本的 Node.js，可以同时配置 exports 和 main 字段。

## 标识产物是否有副作用

`sideEffects` 是用于标识我们的 ES 模块是否有副作用，从而提供更大的压缩空间。目前大部分的打包工具（比如 Webpack）都识别某个模块的 `package.json` 中的 `sideEffects` 字段来确定是否需要把有副作用的代码打包进去。`sideEffects` 默认值是 `true`。

模块副作用是指在模块执行的时候除了导出成员，是否还做其他的事情（比如 `console.log()`、`IIFE` 等）。

举个例子，比如现在的一个组件库在 `src/index.ts` 中导出两个模块：

<Tabs>
<TabItem value="src/index.ts" label="src/index.ts">

```tsx
export { default as Button } from './Button';
export { default as Input } from './Input';
```

</TabItem>
<TabItem value="src/Button/index.tsx" label="src/Button/index.tsx">

```tsx
console.log(123);

export default function Button() {
  return (<button>Click Me</button>)
}
```

</TabItem>
<TabItem value="src/Input/index.tsx" label="src/Input/index.tsx">

```tsx
console.log(123);

export default function Input() {
  return (<input />)
}
```

</TabItem>
</Tabs>

然后我们在使用组件库的时候导入：

```ts
import { Button } from 'your-ui-lib';

.console.log(Button);
```

这时候，虽然没有使用到 Input 模块，但是 Input 模块包含副作用的代码，Tree Shaking 也不会直接移除掉 Input 模块。

如果你明确知道 Input 模块确实没有副作用，你可以在 package.json 中配置 `sideEffects` 来标识我们的代码没有副作用：

```json
{
  "sideEffects": false
}
```

如果确实有些模块是有副作用的，比如你在源码导入全局样式：

```tsx
import 'index.css';
import 'index.scss';
```

你可以在 `sideEffects` 中指定对应的文件：

```json
{
  "sideEffects": [
    "./esm/Input/index.js",
    "*.css",
    "*.less"
  ]
}
```

## 修改版本

在发布前需要更新 `package.json` 中的版本号：

```diff
{
- "version": "1.0.1",
+ "version": "1.1.0"
}
```

或者可以使用以下命令更新版本号：

```bash
$ npm version minor
```

关于 `npm-version` 的更多用法可以参考 [NPM 文档](https://docs.npmjs.com/cli/v9/commands/npm-version?v=true)。


## 构建和发布

ICE PKG 的脚手架默认把构建命令配置在 `prepublishOnly`：

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

执行下面的命令即可把发布到 npm：

```bash
# NPM 会先自动执行 prepublishOnly 脚本然后再发布
$ npm publish
```
