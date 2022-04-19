# 文档预览

@ice/pkg 依赖 [@ice/pkg-plugin-docusaurus](https://github.com/ice-lab/icepkg/tree/master/packages/plugin-docusaurus) 插件支持编写文档和预览组件，所有文档默认存放至 `docs` 文件夹下。支持以 `.md` 及 `.mdx` 为后缀的文档。

在使用文档预览功能前，你需要额外安装 `@ice/pkg-plugin-docusaurus` 插件：

```shell
npm install @ice/pkg-plugin-docusaurus --save-dev

# Or pnpm
pnpm add @ice/pkg-plugin-docusaurus -D
```

并通过 [配置文件](/guide/config-file) 进行加载：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      title: '标题'
    }]
  ]
})
```

大功告成。你可以通过以下指令启动服务：

```shell
# 若存在 docs 文件夹，则默认启动文档预览；并启动 es/lib 编译
$ pkg-cli start

# 不启动文档预览
$ pkg-cli start --doc=false

# 若存在 docs 文件夹，则默认构建预览产物
$ pkg-cli build
```

## 如何书写文档

文档以 `.md` 或 `.mdx` 为后缀，采用 [yaml](https://yaml.org/) 和 [markdown](https://daringfireball.net/projects/markdown/) 语法。

````markdown title=index.md
---
title: Simple Usage
sidebar_position: 1
---

## 本 Demo 演示一行文字的用法

```jsx
import MyComponent from 'my-component';
import './my-component.css';

const App = () => {
  return (
    <div>
      <MyComponent />
    </div>
  )
}

export default MyComponent;
```
````

## 扁平结构

扁平结构的含义是可以将文档平铺在 `docs` 文件夹下：

```shell
.
├── index.md
└── intro.md
```

## 嵌套结构

此外还支持嵌套结构，比如：

```shell
.
├── Foo
│   ├── Basic.md
│   └── Complex.md
├── index.md
└── intro.md
```

## 文档排序

文档默认按照文件（或文件夹）的字母顺序进行排列。若要修改排列顺序，可通过下面两种方式。

+ 使用 `sidebar_position`

可以在文档头部使用 [YAML](https://en.wikipedia.org/wiki/YAML) 标记顺序，比如想要将 `index.md` 设置为：

```markdown
---
sidebar_position: 0
---

# 这是首页，同时也是标题

在此处描述首页说明信息
```

+ 文档添加数字前缀

```shell
.
├── 01-intro.md
├── 02-Foo
│   ├── 01-Basic.md
│   └── 02-Complex.md
└── index.md
```

## 文档标题

文档会默认使用第一个 markdown 标题，作为文档的 title。此外，可以通过 yaml 语法来修改文档标题：

```markdown
---
sidebar_label: 这是标题
---

# 这里不再是默认标题了

在此处描述文档内容...
```

## 代码块

### 将代码渲染成组件

若想要预览组件，需要给代码块添加 `preview` 属性。下面展示的就是给代码块添加 preview 的效果。

```jsx preview
import AddCount from './Button.tsx';

const App = () => {
  return (
    <AddCount />
  )
}

export default App;
```

> 需要注意的是，在 preview 的代码块中引入的样式会 **污染** 全局，因此建议使用 [css-module](https://github.com/css-modules/css-modules) 或 [css-in-js](https://cssinjs.org/) 等方式引入样式。

### 给代码块添加 title

若想要给代码块添加 title，可以使用 `title` 属性。

```jsx title=/src/components/index.js
import MyComponent from 'my-component';
```

## 插件配置

`@ice/pkg-plugin-docusaurus` 插件接受如下配置：

```typescript
export interface PluginDocusaurusOptions {
  /**
   * 文档的 title，默认为 "飞冰组件"
   */
  title?: string;
  /**
   * 文档部署的顶层 url。比如部署在 github，则是 https://你的项目.github.io
   */
  url?: string;
  /**
   * 文档路由的 baseUrl。
   */
  baseUrl?: string;
  /**
   * 文档站点的 favicon 文件位置，默认为 static/img/favicon.ico
   */
  favicon?: string;
  /**
   * 侧边栏 logo，默认为 static/img/logo.png
   */
  navBarLogo?: string;
  /**
   * 侧边栏 title，默认为 "飞冰组件"
   */
  navBarTitle?: string;
  /**
   * 文档启动的端口，默认为 4444
   */
  port?: number;

  /**
   * 自定义 sidebar
   */
  sidebarItemsGenerator?: Function;
};
```
