# 构建能力

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 双模式构建

ICE PKG 原生提供 Transform 构建模式和 Bundle 构建模式，你可以根据实际的开发需求使用对应的构建模式。

### Transform 模式

Transform 模式即把源文件逐个编译到输出目录，不对依赖做任何处理。

假设有以下的文件结构：

```md
src
├── components
   ├── About.jsx
|  └── Button.tsx
├── index.ts
├── util.js
└── index.scss
```

经过 ICE PKG 构建后，得到以下的结果：

```md
esm
├── components
|  ├── About.js
|  ├── Button.d.ts
|  └── Button.js
├── index.d.ts
├── index.ts
├── util.js
├── index.scss
```

可以看到，在 Transform 模式下，ICE PKG 对源文件的处理是：

- 对于 TypeScript 文件，将会被编译成 JavaScript 文件，并输出对应的 `d.ts` 类型文件
- 对于 TSX 和 JSX 文件来说，将会被编译成 JavaScript 文件
- 对于 JavaScript 文件，将会进行语法编译
- 其他类型的文件（比如 `.css`、`.scss` 等等），不做任何编译操作，将会被直接拷贝到输出目录

Transform 模式下输出的产物具有较好的调试性，并且对 Tree-Shaking 友好。适用于大部分开发 React/Rax 组件或者 Node 模块场景。

### Bundle 模式

Bundle 模式即以入口文件作为起点，递归处理各种模块，最终把相同类型的文件合并成一个构建产物。目前 [Webpack](https://webpack.js.org/)、[Rollup](https://rollupjs.org) 等就是对源码进行打包构建的工具。

假设有以下的文件结构：

```
src
├── components
|  └── Button.tsx
├── index.tsx
└── index.scss
```

经过 ICE PKG 构建后，得到以下的构建结果：

```
dist
├── index.esm.es2017.production.js
└── index.esm.es2017.production.css
```

Bundle 模式下输出的产物不需要额外依赖其他模块（不开启 `external` 情况下），一般适用于前端类库要打包成 UMD 格式产物或在浏览器中直接导入构建产物等场景。

## TypeScript

ICE PKG 原生支持引入和使用 `.ts` 文件。使用 [SWC](https://swc.rs/docs/configuration/swcrc) 进行编译，相比 `tsc` 有着数十倍的编译速度提升，同时热更新的时间也有明显的减少。

默认情况下，我们使用的一些模块（比如 `.module.css`、`.jpg` 等）或者全局变量（比如 `NODE_ENV` 等）类型是未定义的，在编辑器中是有报错提示。为此 ICE PKG 默认提供一份类型声明，你可以在项目中新增一个 `d.ts` 类型声明文件并加入以下的内容：

```ts title="src/typings.d.ts"
/// <reference types="@ice/pkg/types" />
```

## JSX

ICE PKG 对于 `.jsx` 和 `.tsx` 同样也是原生支持的。JSX 的编译同样也是使用 [SWC](https://swc.rs/docs/configuration/swcrc)。

## CSS

### 基本用法

比如 `src` 文件夹下存在 `index.tsx` 和 `index.css`，可以直接在 `index.tsx` 引入样式文件。如：
<Tabs>

<TabItem value="index.tsx" label="src/index.tsx">

```tsx
import * as React from 'react';
import './a.css';

export default function Home() {
  return (
    <div className="container"></div>
  )
}
```

</TabItem>
<TabItem value="index.css" label="src/index.css">

```css
.container {
  color: red;
}
```

</TabItem>
</Tabs>

### 预处理器

ICE PKG 内置支持 `.scss`、`.less`、`.sass` 文件，使用方式与 `.css` 文件保持一致。

### CSS Modules

ICE PKG 也支持 [CSS Modules](https://github.com/css-modules/css-modules)，样式文件需以 `.module.css`、`.module.less` 或 `.module.scss` 结尾。

<Tabs>

<TabItem value="index.tsx" label="src/index.tsx">

```tsx
import styles from './index.module.css';

export default () => (
  <div className={styles.root}>
    <div className={styles.item}>Hello</div>
  </div>
);
```

</TabItem>
<TabItem value="index.module.css" label="src/index.module.css">

```css
.root {
  display: flex;
}
.item {
  color: red;
}
```

</TabItem>
</Tabs>

:::tip
如果你在组件里直接通过 `import './index.css'` 的方式引入样式，样式将会对全局样式造成影响。最好给该组件内所有的 CSS 选择器增加前缀，比如：

```diff
- .container {
+ .rc-container { 
  color: red;  
}
```

或者你可以直接使用 CSS Modules 直接引入样式。
:::

## ES2017 产物

ICE PKG 支持额外输出 ES2017 规范的 [Modern 产物](https://web.dev/publish-modern-javascript/)。这份产物在编译时会保留大部分的 JavaScript 语法特性，比如：

+ Class
+ 箭头函数
+ async/await
+ 解构
+ spread 运算符
+ Generator

但可以运行在[大部分的现代浏览器版本](https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions)上（市场份额 > 95%）。当网站不再转译这些语法时，文件的字节数得以大幅减少，从而极大地改善脚本加载性能。

以下面一个简单的 React 组件为例：

```tsx
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const addCount = useCallback(() => {
    setCount((c: number) => c + 1);
  }, [count]);

  return (
    <div>
      <button onClick={addCount}>Add Count</button>
      <p>{count}</p>
    </div>
  );
};

export default App;
```

输出 ES2017 产物与 ES5 产物的大小对比：

| 产物        | 大小  |
|-----------| ----  |
| ES2017 产物 | 1.8k |
| ES5 产物    | 3.7k |

并且，产物大小会随着使用的现代语法特性增多，差距变得越来越大。

:::tip
传统的 NPM 包 开发中，大量的代码仍被编译到 ES5 语法。若你想计算你的网站在使用 es2017 产物后可实现的产物大小和性能的改进，可以试试 [estimator.dev](https://estimator.dev/) 这个工具。
:::

ICE PKG **默认**输出 ES2017 产物。也可通过以下配置输出：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // Transform 模式输出 es2017 产物
  transform: {
    formats: ['es2017'],
  },
  // Bundle 模式输出 es2017 产物
  bundle: {
    formats: ['es2017'],
  },
});
```

## 生成类型文件

ICE PKG 默认为 TypeScript 生成类型文件，**无需主动开启**。

对于一些用户可能使用 [JSDoc](https://jsdoc.app/) 为 JavaScript 生成注解，你可以主动开启为 JavaScript 代码生成类型文件的能力。

比如，函数 `add` 通过 **JSDoc** 进行类型注解：

```js
/**
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
  return a + b;
}
```

为 JavaScript 文件开启 [generateTypesForJs](../reference/config#generatetypesforjs) 配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  generateTypesForJs: true,
});
```

则会生成一个 `add.d.ts` 文件，内容如下：

```ts
export function add(a: number, b: number): number;
```

:::warning 谨慎使用该配置
若贸然为没有使用 JSDoc 注解的 JavaScript 代码开启该配置，可能会出现自动类型推断错误的情况。
:::
