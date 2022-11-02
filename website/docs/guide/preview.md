# 文档预览

ICE PKG 依赖 [@ice/pkg-plugin-docusaurus](https://github.com/ice-lab/icepkg/tree/master/packages/plugin-docusaurus) 插件支持编写文档和预览组件，所有文档默认存放至 `docs` 文件夹下。支持以 `.md` 及 `.mdx` 为后缀的文档。

在使用文档预览功能前，你需要先手动安装 `@ice/pkg-plugin-docusaurus` 插件：

```shell
npm install @ice/pkg-plugin-docusaurus --save-dev
```

并通过 [配置文件](./config) 进行加载：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        title: '标题'
      },
    ],
  ],
});
```

大功告成。你可以通过以下命令启动预览：

```shell
# 若存在 docs 文件夹，则默认启动文档预览；并启动 es/lib 编译
$ npm start

# 若存在 docs 文件夹，则默认构建预览产物
$ npm run build
```


## 关闭文档预览

`@ice/pkg-plugin-docusaurus` 插件接受 `enable` 配置以决定是否启用文档预览，该值默认为 `true`。如果需要关闭文档预览，可以配置如下：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        enable: false
      },
    ],
  ],
});
```

你也可以根据启动的命令来配置是否开启文档预览构建：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        // start 命令时启用文档预览，build 命令时关闭文档预览产物构建
        enable: {
          start: true,
          build: false
        }
      },
    ],
  ],
});
```



## 如何书写文档

文档以 `.md` 或 `.mdx` 为后缀，采用 [yaml](https://yaml.org/) 和 [markdown](https://daringfireball.net/projects/markdown/) 语法。

````markdown title=index.md
---
title: 简单的用法
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

扁平结构的意思是可以将文档平铺在 `docs` 文件夹下：

```shell
.
├── index.md
└── intro.md
```

## 嵌套结构

此外还支持嵌套结构，如：

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

若想要预览组件，需要给代码块添加 `preview` 属性。

````
```tsx preview
import AddCount from './Button.tsx';

const App = () => {
  return (
    <AddCount />
  )
}

export default App;
```
````

下面展示的就是给上述代码块添加 preview 的效果。

```jsx preview
import AddCount from './Button.tsx';

const App = () => {
  return (
    <AddCount />
  )
}

export default App;
```

> 需要注意的是，在 preview 的代码块中引入的样式会 **污染** 全局，因此建议使用 [CSS Modules](https://github.com/css-modules/css-modules) 或 [css-in-js](https://cssinjs.org/) 等方式引入样式。

:::info 仅支持 React 组件和 Rax 组件
目前只支持为 `jsx`、`tsx` 代码块添加 `preview` 属性。
:::

### 将代码块渲染成移动端预览的样式

通过配置 `mobilePreview: true` 开启将预览方式设置成移动端预览的样式：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        mobilePreview: true,
      },
    ],
  ],
});
```

同理，所有添加了 [preview: true](#将代码渲染成组件) 的代码块会渲染成下面的样式：

![](https://gw.alicdn.com/imgextra/i2/O1CN01UVaMo71q7gujCYGSc_!!6000000005449-2-tps-1338-761.png)


### 引入当前包的包名

直接引入正在开发的包名 (package.json 中的 name 字段值)，像真实的用户一样在文档中导入你这在开发的包。比如你正在开发一个包名为 `my-component` 的组件：

```js
// 'my-component' 是你正在开发的包名
import MyComponent from 'my-component';

export default function App() {
  return (
    <MyComponent />
  );
}
```

### 给代码块定制自定义标题

若想要给代码块定制自定义标题，可以使用 `title` 属性：

````
```jsx title=/src/components/index.js
import MyComponent from 'my-component';

export default function Index() {
  return (
    <MyComponent />
  );
}
```
````

文档渲染效果如下：

```jsx title=/src/components/index.js
import MyComponent from 'my-component';

export default function Index() {
  return (
    <MyComponent />
  );
}
```

## 自定义侧边栏

若你想要完全自定义侧边栏，比如有以下平铺结构：

```shell
├── index.md
├── a.md
├── b.md
└── c.md
```

并试图将 `a.md`、`b.md` 和 `c.md` 收敛到一个 `示例` 的目录下，可以通过 `sidebarItemsGenerator` 进行配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      sidebarItemsGenerator: async () => {
        return [
          { type: 'doc', id: 'index' },
          {
            type: 'category',  // 收敛到一个目录中
            label: '实例',      // 目录名
            collapsed: false,  // 目录是否折叠
            items: [
              { type: 'doc', id: 'a' },
              { type: 'doc', id: 'b' },
              { type: 'doc', id: 'c' },
            ],
          },
        ];
      },
    }],
  ],
});
```

## 隐藏文档右侧导航

在 [Mobile 组件预览](#将代码块渲染成移动端预览的样式) 下，若感觉整体内容区比较窄。或因为其他原因，想要隐藏右侧导航栏。可在文档顶部添加 `hide_table_of_contents` 这一配置。

```md
---
hide_table_of_contents: true
---

## 本 Demo 演示一行文字的用法

```

## 预览仅浏览器端可用的组件

开发者在开发组件时，可能会使用到 BOM/DOM API（例如代码中访问了 `window` 或者 `document` 变量），则该组件仅为浏览器端可用。在执行 `npm run build` 命令进行文档预览产物的静态构建时，该组件在服务端环境下将无法正确构建渲染，并会导致文档构建失败。此时可在文档中的代码块内使用 [`<BrowserOnly>`](https://docusaurus.io/docs/docusaurus-core/#browseronly) 组件来包裹用户开发的组件，示例如下：

```js
// ICE PKG 自动注入 BrowserOnly，无需手动引入
export default function App() {
  return (
    <BrowserOnly>
      {
        () => {
          // 'my-component' 是你正在开发的包名
          const MyComponent = require('my-component').default;
          return <MyComponent />
        }
      }
    </BrowserOnly>
  );
}
```

## 插件配置

`@ice/pkg-plugin-docusaurus` 插件接受以下配置：

```typescript
export interface PluginDocusaurusOptions {
  /**
   * 是否启用文档预览构建，默认为 true
   */
  enable?: boolean | { start: boolean; build: boolean };
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
   * 侧边栏 title，默认为 "ICE PKG"
   */
  navBarTitle?: string;
  /**
   * 文档启动的端口，默认为 4000
   */
  port?: number;

  /**
   * 自定义 sidebar
   */
  sidebarItemsGenerator?: Function;

  /**
   * 开启移动端组件预览
   */
  mobilePreview?: boolean;

  /**
   * 文档默认语言，默认值为 zh-Hans，即中文
   */
  defaultLocale?: string;

  /**
   * 文档需要构建的多语言版本，必须包含 defaultLocale，默认值为 ['zh-Hans']，即中文
   */ 
  locales?: string[];
};
```
