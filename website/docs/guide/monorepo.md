# Monorepo

ICE PKG 提供了对 Monorepo 方案的支持。目前支持：

- 子项目之间依赖链接，方便进行本地调试
- 结合类似 `Changesets`、`Rush` 等方案完成子项目版本管理和发布

## 开发环境准备

ICE PKG 的 Monorepo 方案是基于 [pnpm workspace](https://pnpm.io/workspaces) + 包构建器 [`@ice/pkg`](https://www.npmjs.com/package/@ice/pkg)，因此我们需要确保我们的开发环境满足：

- [pnpm](https://pnpm.io/) 版本确保是 7 或以上
- [node.js](https://nodejs.org) 版本确保是 18 或以上，推荐使用 20

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
├── build.config.mts # 文档预览配置文件
├── package.json
├── packages # 存放子项目的目录
| ├── component-a
| ├── component-b
| └── component-c
├── pages # 文档首页
| ├── index.module.css
| └── index.tsx
├── pnpm-workspace.yaml # 定义工作空间的子项目
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

这时会监听每个子项目的代码变更，持续构建产物。

这时我们可以修改源码，进行本地调试了。

## 发布

对于 npm 包进行版本管理和发布，ICE PKG 推荐使用社区的版本控制工具：

- [changesets](https://github.com/changesets/changesets)
- [rush](https://rushjs.io/)
