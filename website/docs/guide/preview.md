# 文档预览

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

使用 [@ice/pkg-plugin-docusaurus](https://github.com/ice-lab/icepkg/tree/master/packages/plugin-docusaurus) 插件，依托 [Docusaurus](https://docusaurus.io/) 提供的能力，支持编写组件/库文档和预览组件。所有文档默认存放至 `docs` 文件夹下。支持以 `.md` 及 `.mdx` 为后缀的文档。

在使用文档预览功能前，你需要先手动安装 `@ice/pkg-plugin-docusaurus` 插件：

```shell
$ npm install @ice/pkg-plugin-docusaurus --save-dev
```

并在配置文件中配置插件：

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
# 若存在 docs 文件夹，则默认启动本地文档预览服务
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

```tsx
import * as React from 'react';
import MyButton from 'my-button';
import './my-button.css';

const App = () => {
  return (
    <main>
      <div>Hello World</div>
      <MyButton />
    </main>
  )
}

export default App;
```
````
### 文档结构
#### 扁平结构

扁平结构的意思是可以将文档平铺在 `docs` 文件夹下：

```shell
.
├── index.md
└── intro.md
```

#### 嵌套结构

此外还支持嵌套结构，如：

```shell
.
├── Foo
│   ├── Basic.md
│   └── Complex.md
├── index.md
└── intro.md
```

### 文档排序

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

### 文档标题

文档会默认使用第一个 markdown 标题，作为文档的 title。此外，可以通过 yaml 语法来修改文档标题：

```markdown
---
sidebar_label: 这是标题
---

# 这里不再是默认标题了

在此处描述文档内容...
```

### 代码块

#### 将代码渲染成组件

若想要预览组件，需要给代码块添加 `preview` 属性。

````
```tsx preview
import * as React from 'react';
import AddCount from './Button';

const App = () => {
  return (
    <AddCount />
  )
}

export default App;
```
````

下面展示的就是给上述代码块添加 preview 的效果。

```tsx preview
import * as React from 'react';
import AddCount from './Button';

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

:::tip
在 Markdown 代码块中编写代码会失去类型提示和类型校验。

推荐使用 VSCode 插件 [TS in Markdown](https://marketplace.visualstudio.com/items?itemName=amour1688.ts-in-markdown) 以获得类型提示。

推荐使用 `tsx` 代码块以获得类型校验，并需要确保在 `tsconfig.json` 中指定以下内容：
```json
{
  "paths": {
    // 假设 my-component 是你的组件名称
    "my-component": ["./src"],
    "my-component/*": ["./src/*"]
  }
}
```
:::

#### 将代码块渲染成移动端预览的样式

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


#### 引入当前包的包名

直接引入正在开发的包名 (package.json 中的 name 字段值)，像真实的用户一样在文档中导入你这在开发的包。比如你正在开发一个包名为 `my-button` 的组件：

```tsx
import * as React from 'react';
// 假设 'my-button' 是你正在开发的包名
import MyButton from 'my-button';

export default function App() {
  return (
    <MyButton />
  );
}
```

#### 给代码块定制自定义标题

若想要给代码块定制自定义标题，可以使用 `title` 属性：

````
```tsx title=/src/components/index.jsx
import * as React from 'react';
import MyButton from 'my-button';

export default function Index() {
  return (
    <MyButton />
  );
}
```
````

文档渲染效果如下：

```tsx preview
import * as React from 'react';
import MyButton from 'my-button';

export default function Index() {
  return (
    <>
      <MyButton>Hello</MyButton>
    </>
  );
}
```

## 自动生成组件文档

使用 `@ice/remark-react-docgen-docusaurus` 插件(基于 [react-docgen](https://github.com/reactjs/react-docgen/tree/5.x))可自动生成组件 Props 文档。

首先我们需要先安装插件依赖：

```bash
$ npm i @ice/remark-react-docgen-docusaurus --save-dev
```

然后我们把插件增加到配置中：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
        remarkPlugins: [
          "require('@ice/remark-react-docgen-docusaurus')",
        ],
      },
    ],
  ],
});
```

假设我们有这样的一个 Button 组件：
<Tabs>

<TabItem value="src/Button/index.tsx" label="src/Button/index.tsx">

```tsx
import * as React from 'react';
import './index.scss';

interface ButtonProps {
  /**
   * 设置按钮类型
   */
  type?: 'primary' | 'default';
  /**
   * 点击按钮时的回调
   */
  onClick: React.MouseEventHandler;
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props: ButtonProps) => {
  const {
    type = 'default',
  } = props;
  const typeCssSelector = {
    primary: 'pkg-btn-primary',
    default: 'pkg-btn-default',
  };
  return (
    <button
      className={`pkg-btn ${typeCssSelector[type] || ''}`}
      onClick={props.onClick}
      data-testid="normal-button"
    >
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  type: 'default',
};

export default Button;
```
</TabItem>

<TabItem value="src/Button/index.scss" label="src/Button/index.scss">

```scss
.pkg-btn {
  border-radius: 6px;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  text-align: center;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 400;

}

.pkg-btn-primary {
  color: #fff;
  background-color: #1677ff;
  box-shadow: 0 2px 0 rgb(5 145 255 / 10%);
}

.pkg-btn-default {
  background-color: #fff;
  border-color: #d9d9d9;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
}
```

</TabItem>
</Tabs>

然后我们在文档中加入以下内容：

```mdx title="docs/button.md"
## API

<ReactDocgenProps path="../src/Button/index.tsx"></ReactDocgenProps>
```

`@ice/remark-react-docgen-docusaurus` 插件会识别到 `<ReactDocgenProps />` 组件来快速生成组件 Props 文档。效果图如下：

![](https://img.alicdn.com/imgextra/i3/O1CN01xBo8CB1x4DI1PaSrF_!!6000000006389-0-tps-1196-428.jpg)

:::caution
目前有几点限制需要注意：

1. 约定一个文件只能导出一个组件
2. 无法解析从其他模块中导入的类型声明，因此只能在当前文件模块中声明组件的 Props 类型（[详见](https://github.com/reactjs/react-docgen/tree/5.x#flow-and-typescript-support)）
3. 函数组件需要在函数入参中指定 props 类型，比如 `const Component = (props: ComponentProps) => {}`，否则无法解析
4. 必须以 TSDoc 的形式书写注释（`// ` 形式的单行注释无法被提取）
5. 默认值必须以 `Component.defaultProps = {}` 的形式书写，才能被工具提取
:::

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

更多关于 `sidebarItemsGenerator` 的用法请见 [Docusaurus 文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#sidebarItemsGenerator)。

## 自定义文档首页

默认情况下，根路由显示的是 `README.md` 的内容。比如：

![](https://img.alicdn.com/imgextra/i4/O1CN01rNo50g1hotnPKjSGi_!!6000000004325-2-tps-2250-1440.png)

如果想定制首页，比如不带左侧侧边栏，可以加入以下的配置：

```js title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
         pageRouteBasePath: '/',
         docsRouteBasePath: '/docs',
      }
    ],
  ],
});
```

然后在项目根目录下增加 pages 目录，新增 `index.tsx` 或者 `index.md` 文件，此文件将会被渲染到根路由。

路由渲染规则请参考 [Docusaurus 文档](https://docusaurus.io/docs/creating-pages)。

## 隐藏文档右侧导航

在 [Mobile 组件预览](#将代码块渲染成移动端预览的样式) 下，若感觉整体内容区比较窄。或因为其他原因，想要隐藏右侧导航栏。可在文档顶部添加 `hide_table_of_contents` 这一配置。

```md
---
hide_table_of_contents: true
---

## 本 Demo 演示一行文字的用法

```

## 插件配置

`@ice/pkg-plugin-docusaurus` 插件接受以下配置：

#### enable

- 类型：`boolean | { start: boolean; build: boolean }`
- 默认值：`true`

是否启用文档预览构建。

#### title

- 类型：`string`
- 默认值：`'ICE PKG'`

配置文档标题。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        title: 'My Docs'
      },
    ],
  ],
});
```

#### url

- 类型：`string`
- 默认值：`'/'`

文档部署域名。比如部署在 github，则是 `https://your-repo.github.io`。

#### baseUrl

- 类型：`string`
- 默认值：`'/'`

文档路由的基准路由。比如如果配置了 `/metro`，则文档的基准地址是 `https://your-repo.github.io/metro`

#### favicon

- 类型：`string`
- 默认值：`'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico'`

文档站点的 favicon 的地址。可以是相对部署根目录的路径，比如 `static/img/favicon.ico`。

#### navBarLogo

- 类型：`string`
- 默认值：`'https://img.alicdn.com/imgextra/i1/O1CN01lZTSIX1j7xpjIQ3fJ_!!6000000004502-2-tps-160-160.png'`

侧边栏的 logo。可以是相对部署根目录的路径，比如 `static/img/logo.png`。

#### navBarTitle

- 类型：`string`
- 默认值：`'ICE PKG'`

侧边栏标题。

#### host

- 类型：`string`
- 默认值：本机 IP

文档本地预览服务启动的 Host。

#### port

- 类型：`number`
- 默认值：`4000`

文档本地预览服务启动的端口号。

#### sidebarItemsGenerator

- 类型：`SidebarGenerator`

自定义 sidebar 内容，详细说明见 [Docusaurus 文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#sidebarItemsGenerator)。

#### mobilePreview

- 类型：`boolean`
- 默认值：`false`

开启移动端组件预览模式。
#### defaultLocale

- 类型：`string`
- 默认值：`'zh-Hans'`

文档默认语言。

#### locales

- 类型：`string[]`
- 默认值：`['zh-Hans']`

文档需要构建的多语言版本。必须包含 defaultLocale。

#### outputDir

- 类型：`string`
- 默认值：`'build'`

配置 Docusaurus 构建产物输出地址。

#### path

- 类型：`string`
- 默认值：`'docs'`

存放文档的目录，将会扫描该目录下所有的 `.md` 和 `.mdx` 文件并生成文档页面。相关规则说明详见[文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#path)。

#### docsRouteBasePath

- 类型：`string`
- 默认值：`'/'`

文档基准路由，类似于 React Router 中的 `basename`，配置时需要注意的是首个字符不能是 `/`。比如以下的目录结构对应的页面路由如下：

| 页面路径           | 路由          |
| ------------------ | ------------- |
| `/docs/index.md` | `/`      |
| `/docs/usage.md`  | `/usage` |

#### pagePath

- 类型：`string`
- 默认值：`'pages'`

存放页面的目录，该目录下的组件将会自动生成为页面，一个组件的文件路径会被映射生成对应的路由。页面路由规则详见[文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages#path)。

#### pageRouteBasePath

- 类型：`string`
- 默认值：`'/pages'`

页面基准路由，类似于 React Router 中的 `basename`。比如以下的目录结构对应的页面路由如下：

| 页面路径           | 路由          |
| ------------------ | ------------- |
| `/pages/index.tsx` | `/pages`      |
| `/pages/home.tsx`  | `/pages/home` |

#### plugins

添加额外的 [Docusaurus 插件](https://docusaurus.io/docs/api/plugin-methods)，以扩展更多 Docusaurus 的能力。

<Tabs>

<TabItem value="build.config.mts" label="build.config.mts">

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', 
      {
        plugins: [
          // 添加本地的 docusaurus 插件
          require.resolve('./docusaurus-plugin.js'),
          // 你也可以添加插件包
          '@docusaurus/plugin-pwa',
        ]
      },
    ],
  ],
});
```

</TabItem>

<TabItem value="docusaurus-plugin.js" label="docusaurus-plugin.js">

```js
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    async contentLoaded({ content, actions }) {
      console.log(content);
    },
  };
};
```

</TabItem>
</Tabs>
