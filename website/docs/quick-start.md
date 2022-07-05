# 快速开始

## 环境准备

### 1. Node.js

使用 ICE PKG 开发前需要安装 [Node.js](https://nodejs.org)，并确保 node 版本是 14.x 或以上。

### 2. 包管理工具

安装 Node.js 后，默认会包含 npm。在国内使用 npm 安装依赖可能会比较慢。建议使用 [cnpm](https://www.npmjs.com/package/cnpm) 的国内镜像源进行加速：

```bash
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
# 验证 cnpm 安装是否成功
$ cnpm -v
```

除此之外，你还可以使用 [pnpm](https://pnpm.io/)、[yarn](https://yarnpkg.com/) 等其他包管理工具。本文档仍以 npm 作为示例。

## 初始化

以 React 组件类型为例，通过以下命令，可以快速初始化一个项目：

```bash
$ npm init @ice/pkg react-component
```

选择 React 组件项目类型：
```bash
? 请选择项目类型 (Use arrow keys)
  前端类库
  Node 模块
❯ React 组件
  Rax 组件
```

## 启动项目

```bash
$ cd react-component
$ npm start
```

现在，访问 `http://localhost:4000`，即可查看组件 README 文档：

![demo-readme](https://img.alicdn.com/imgextra/i2/O1CN01OctOw81JXuHCC6FhP_!!6000000001039-2-tps-1110-720.png)

访问 `http://localhost:4000/usage`，即可预览组件：

![component-preview](https://img.alicdn.com/imgextra/i3/O1CN01uEHuWp1DtXHv6uwax_!!6000000000274-2-tps-1160-540.png)

## 生成构建产物

```shell
$ npm run build
```

## 发布产物

修改包名

执行发布命令：

```bash
$ npm publish
```
