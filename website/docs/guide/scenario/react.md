# React 组件

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

如果你在多个不同的项目中共同使用了一个或多个 React 组件，那么你可以考虑把这些公共的 React 组件抽成一个 npm 包，这样你就可以在不同的项目中复用组件了。

## 单组件

假设一个 npm 包仅导出一个 React 组件，推荐使用以下目录结构和写法：

```md
src
├── Header # 子组件 Header
│ ├── index.css
│ └── index.tsx
└── index.tsx
```

<Tabs>
<TabItem value="index.tsx" label="index.tsx">

```tsx
import Header from './Header';

//  通过 export default 方式导出
export default function Component() {
  return (
    <div>
      <Header />
      ...
    </div>
  );
}
```

</TabItem>

<TabItem value="Header/index.tsx" label="Header/index.tsx">

```tsx
import './index.css';

export default function Header() {
  return <div>Header</div>;
}
```

</TabItem>
</Tabs>

这样在消费处可以通过 `import Component from 'your-component-name'` 的方式导入组件了。

## 组件库

假如一个 npm 包要导出多个不同的组件（即组件库），推荐使用以下的目录组织结构和写法：

```md
src
├── Button
│ ├── index.css
│ └── index.tsx
├── Input
│ ├── index.css
│ └── index.tsx
└── index.ts
```

<Tabs>
<TabItem value="index.ts" label="index.ts">

```ts
export * from './Button';
export * from './Input';
```

</TabItem>

<TabItem value="Button/index.tsx" label="Button/index.tsx">

```tsx
import * as React from 'react';

export function Button() {
  return <button>example</button>;
}
```

</TabItem>
</Tabs>

`src/index.ts` 作为组件库的入口文件，然后统一导出不同的 React 组件，这样就可以通过 `import { Button, Input } from 'your-component-name';` 导入组件了。

:::tip
有关样式的说明和写法请参考 [CSS](../css) 文档。
:::

## JSX 支持

ICE PKG 对 `.jsx` 和 `.tsx` 原生支持，使用 [SWC](https://swc.rs/docs/configuration/swcrc) 编译，无需任何额外配置即可直接使用。

JSX 的转换方式可通过 [`jsxRuntime`](../../config/jsx-runtime) 配置项调整，默认使用 `automatic` 模式（无需手动引入 `React`）。

## 发布配置

### exports

推荐在 `package.json` 中配置 `exports` 字段声明 npm 包的入口：

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

如果需要兼容较低版本的 Node.js，还需同时配置 `main` 字段：

```json
{
  "main": "./cjs/index.js"
}
```

:::tip
`exports` 的优先级高于 `main`，两者可以同时配置以兼容不同环境。更多导出规则可参考 [Node.js 文档](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points)。
:::

### sideEffects

`sideEffects` 用于告知打包工具（如 Webpack）当前模块是否有副作用，从而开启更激进的 Tree Shaking。默认值为 `true`。

如果你的组件库代码没有副作用，可以设置为 `false`：

```json
{
  "sideEffects": false
}
```

如果部分文件（如全局样式）确实有副作用，可以单独列出：

```json
{
  "sideEffects": ["*.css", "*.less"]
}
```
