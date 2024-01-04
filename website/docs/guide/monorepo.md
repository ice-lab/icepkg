# Monorepo

ICE PKG 提供了对 Monorepo 方案的支持。目前支持：

- 子项目之间依赖链接，方便进行本地调试
- 结合类似 `Changesets`、`Rush` 等方案完成子项目版本管理和发布

## 开发环境准备

ICE PKG 的 Monorepo 方案是基于 [pnpm workspace](https://pnpm.io/workspaces) + 包构建器 [`@ice/pkg`](https://www.npmjs.com/package/@ice/pkg)，因此我们需要确保我们的开发环境满足：

- [pnpm](https://pnpm.io/) 版本确保是 7 或以上
- [node.js](https://nodejs.org) 版本确保是 16 或以上

## 创建项目

通过以下命令，可以快速初始化一个 Monorepo 项目：

```bash
$ pnpm create @ice/pkg my-monorepo
```

选择 React 组件项目类型：
```bash
? 请选择项目类型 (Use arrow keys)
  React 组件
  Node 模块
  前端类库  
  Rax 组件
❯ Monorepo React 组件
  Monorepo Node 模块  
```

## 目录介绍

以一个多 React 组件默认脚手架项目为例子：

```md
├── build.config.mts       # 文档预览配置文件
├── package.json
├── packages               # 存放子项目的目录
|  ├── component-a
|  ├── component-b
|  └── component-c
├── pages                  # 文档首页
|  ├── index.module.css
|  └── index.tsx
├── pnpm-workspace.yaml    # 定义工作空间的子项目
├── tsconfig.base.json
└── tsconfig.json
```

## 创建子项目

在项目根目录下，执行以下命令创建一个子项目：

```shell
# 假设 packages 目录是用于存放子项目
$ pnpm create @ice/pkg packages/your-lib --workspace
```

执行成功后，你将会看到以下内容：

```shell
? 请选择项目类型 (Use arrow keys)
❯ React 组件
  Node 模块
  前端类库  
  Rax 组件
```

根据实际的需求选择对应的项目类型，然后填写子项目的 npm 包名后，完成子项目的创建。

然后，我们还需要在根目录的 package.json 中 `devDependencies` 里添加依赖，以能正常启动文档预览服务（详细原因在后面[文档预览](#文档预览)小节中会讲到）：

```diff
# package.json
{
  "devDependencies": {
+   "@ali/your-lib": "workspace:*"
  }
}
```

## 本地调试

在项目根目录下执行以下命令进行安装并构建工作区(workspace)的每个子项目：

```bash
$ pnpm install && pnpm packages:build
```
这个时候，所有的依赖都安装完成，并且有依赖的子项目之间也自动 link 好了。

我们在项目根目录下执行以下命令启动调试：

```bash
$ pnpm start
```

这时会监听每个子项目的代码变更，并启动文档预览服务：

![undefined](https://img.alicdn.com/imgextra/i2/O1CN01UwaC811GIqSgUoo7p_!!6000000000600-2-tps-1126-814.png) 

这时我们可以修改源码，进行本地调试了。

## 文档预览

文档预览服务基于 [`@ice/pkg-plugin-docusaurus`](./preview) ICE PKG 插件。推荐一个 Monorepo 项目存在一个文档站点服务，并支持预览所有的子项目的文档。

### 添加依赖到根目录的 `package.json`

由于启动文档本地预览调试是在项目的根目录进行，但在子项目的文档中通常直接依赖了子包，在文档进行打包构建的时候会找不到对应的子包，因此需要在项目根目录的 `package.json` 中添加对应的子项目依赖：

```diff
# package.json
{
  "devDependencies": {
+   "@ali/your-lib": "workspace:*"
  }
}
```

### 子项目文档预览

`packages` 目录下每个子项目都会有一个 `docs` 目录，用来存放该子项目的文档。比如：

```md
./packages/component-a
├── README.md
├── build.config.mts
├── docs
|  ├── index.md
|  ├── usage.md
|  └── usage.md
├── package.json
├── src
└── tsconfig.json
```

在项目根目录下执行以下命令，会起一个 docusaurus 的文档预览：

```shell
$ pnpm docs:start
```

访问控制台中打印的文档地址就能查看文档了：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/301926/1673436424615-4d7bb212-8072-4a38-a644-21ca2a41fd34.png) 

以  `packages` 目录为根目录，页面的路由默认根据下每个子项目的文件路径自动生成的。比如上面的 `./packages/component-a/docs/index.md`，路由会自动为 `/component-a/docs/`（没有 `packages` 前缀）。

所有的文档选项配置，都在根目录的 `build.config.mts` 文件中配置，下面是推荐的配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
        path: 'packages',
        sidebarItemsGenerator: (args: any) => {
          // The index.md doc should not be the category, so we rewrite the default isCategoryIndex function.
          function isCategoryIndex({ fileName, directories }: any) {
            const eligibleDocIndexNames: string[] = [
              'readme',
              directories[0].toLowerCase(),
            ];
            return eligibleDocIndexNames.includes(fileName.toLowerCase());
          }
          const defaultSidebarItems = args.defaultSidebarItemsGenerator({
            ...args,
            isCategoryIndex,
          });
          // 1. Remove the `docs` category.
          // 2. Remove category link.
          const newSidebarItems = defaultSidebarItems.map(({ link, ...rest }: any) => ({
            ...rest,
            items: rest.items.map((item: any) => item.items).flat(),
          }));

          return newSidebarItems;
        },
        exclude: ['**/node_modules/**'],
        onBrokenLinks: 'warn',
      },
    ],
  ],
});
```

更多配置说明可参考[文档预览](https://pkg.ice.work/guide/preview)。

### 定制文档首页

默认情况下，当我们访问根路由(`/`)是返回 404 页面的。如果我们想定制文档首页的内容，我们可以增加 [`pageRouteBasePath`](./preview#pageroutebasepath) 配置：

首先在 `build.config.mts` 中新增以下内容：
```diff
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
+       pageRouteBasePath: '/',
      },
    ],
  ],
});
```

然后在根目录下新增 `pages` 目录，然后新增 `index.tsx` 或者` index.md` 文件，此文件将会被渲染到根路由。

```tsx
// pages/index.tsx
export default function Home() {
  return (
    <div>我是首页</div>
  )
}
```

## 发布

对于 npm 包进行版本管理和发布，ICE PKG 推荐使用社区的版本控制工具：

- [changesets](https://github.com/changesets/changesets)
- [rush](https://rushjs.io/)
