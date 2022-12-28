# 构建能力

:::tip
ICE PKG 的所有配置请参阅 [完整配置项](./config)。
:::

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

为 JavaScript 文件开启 [generateTypesForJs](./config#generatetypesforjs) 配置：

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

## 支持样式和预处理器

ICE PKG 默认支持 css、sass、less 等语法。若 `src` 文件夹下存在 `index.ts` 和 `a.css` 和 `b.css` 文件，可以直接在 `index.ts` 引入样式文件。如：

```ts
import './a.css';
import './b.css'
```

在 [transform 模式](../#双模式) 下，样式文件会伴随 `index.ts` 一起编译到目标目录，会保持引入关系（见 [使用场景 - 单模块引入](../scenarios/react#单模块引入)）。

在 [bundle 模式下](../#双模式) 下，样式会整体打包输出（见 [使用场景 - 分别引入 JS 和 CSS](../scenarios/react#分别引入-js-和-css) ）。

ICE PKG 也支持 [CSS Modules](https://github.com/css-modules/css-modules)，样式文件需以 `.module.css`、`.module.less` 或 `.module.sass` 结尾。

```ts
import styles from './index.module.css';

export default () => (
  <div className={styles.root}>
    <div className={styles.item}>Hello</div>
  </div>
);
```

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
  // transform 模式输出 es2017 产物
  transform: {
    formats: ['es2017'],
  },
  // bundle 模式输出 es2017 产物
  bundle: {
    formats: ['esm', 'es2017'],
  },
});
```

## SWC 编译

ICE PKG 采用 SWC 进行 JS 代码的 transform 及 minify。你可以通过自定义插件中的 [`swcCompileOptions`](../plugins-development#swccompileoptions) 来配置 SWC 的编译选项。

:::tip
transform 模式的产物代码中可能依赖一些 helper 函数用以支持目标环境。ICE PKG 默认将这些 helper 函数统一从 `@swc/helpers` 中导出使用，以减小产物代码体积。因此，当你的产物代码中使用了 `@swc/helpers` 时，请务必将 `@swc/helpers` 加到项目的 dependencies 中并安装之。
:::
