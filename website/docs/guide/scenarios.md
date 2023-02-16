# 构建场景

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

ICE PKG 默认支持 React 组件、Rax 组件、Node 模块、前端类库研发场景。你可以执行下面的命令：

```bash
$ npm init @ice/pkg my-lib
```

根据实际研发需求，选择对应的脚手架：

```bash
? 请选择项目类型 (Use arrow keys)
❯ React 组件
  Rax 组件
  Node 模块
  前端类库
```

## React 组件

如果你在多个不同的项目中共同使用了一个或多个 React 组件，那么你可以考虑把这些公共的 React 组件抽成一个 npm 包，这样你就可以在不同的项目中复用组件了。

假设一个 npm 包仅导出一个 React 组件，推荐使用以下目录结构和写法：

```md
src
├── Header        # 子组件 Header
|  ├── index.css
|  └── index.tsx
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
  )
}
```

</TabItem>

<TabItem value="Header/index.tsx" label="Header/index.tsx">

```tsx
import './index.css';

export default function Header() {
  return (<div>Header</div>)
}
```

</TabItem>
</Tabs>

这样在消费处可以通过 `import Component from 'your-component-name'` 的方式导入组件了。

假如一个 npm 包要导出多个不同的组件，也就是类似我们常说的组件库，推荐使用以下的目录组织结构和写法：

```md
src
├── Button
|  ├── index.css
|  └── index.tsx
├── Input
|  ├── index.css
|  └── index.tsx
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
  return (
    <button>example</button>
  )
}
```

</TabItem>
</Tabs>

:::tip
有关样式的说明和写法请参考[构建能力 - CSS](./abilities#css) 文档。
:::

`src/index.ts` 作为组件库的入口文件，然后统一导出不同的 React 组件，这样就可以通过 `import { Button, Input } from 'your-component-name';` 导入组件了。

## Rax 组件

与 React 组件场景类似，你可以把公共的 Rax 组件抽成一个 npm 包，然后在其他项目中使用。

```tsx title="src/index.tsx"
import { createElement } from 'rax';
import styles from './index.module.css';

export default function Component() {

  return (
    <div className={styles.Component}>Hello</div>
  );
}
```

:::caution
注意：Rax 组件必须要显式引入 `createElement` 函数，否则无法正常渲染。
:::

组件的目录结构组织和源码写法可参考[React 组件章节](#react-组件)。

## Node 模块

如果现在有相同的工具函数在多个 Node 应用被消费，可以把这些公共的函数抽成一个 npm 包，供多个 Node 应用使用。支持经过 Transform 模式生成 CommonJS 产物和 ES Module 产物。

## 前端类库

前端类库指的是运行在浏览器环境中的 JavaScript 模块，并且所有的依赖都会打包到这个模块里面。使用的场景有：

1. 类似 [React](https://unpkg.com/browse/react@18.2.0/umd/)、[moment](https://unpkg.com/browse/moment@2.29.4/min/) 等类库，用户的项目中把这些依赖 external 掉，需要在 HTML 中通过 `<script />` 引入 UMD 产物：
```html
<html>
<head>
  <script src="https://unpkg.com/your-lib-name/dist/index.umd.es5.production.js"></script>
</head>
<body>
  <script>
    console.log(window.YourLibName);
  </script>
</body>
</html>
```

同时提供未压缩的版本，满足开发态调试的需求：

```html
<html>
<head>
  <script src="https://unpkg.com/your-lib-name/dist/index.umd.es5.development.js"></script>
</head>
</html>
```

2. 在 `<script />` 标签内通过 `ES Module` 方式加载类库：

```html
<html>
  <body>
    <script type="module">
      import lib from './index.es2017.production.js';
    </script>
  </body>
</html>
```