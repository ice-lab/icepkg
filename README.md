# Iceworks CLI

物料开发工具

## 特性

- 支持开发自定义物料集合，同时在 VS Code 中可视化创建以及添加物料到项目中
- 支持区块/业务组件/脚手架不同的物料类型开发
- 内置多套物料模板（React/Rax/Vue/...）
- 支持开发私有的物料集合
- 支持自定义物料模板

## 快速开始

全局安装 CLI：

```bash
$ tnpm i -g iceworks
$ iceworks -V
-> 3.2.5
```

初始化物料集合：

```bash
$ mkdir custom-materials && cd materials
$ iceworks init material

# or init single component
$ iceworks init component
```

添加物料：

```bash
$ iceworks add // support block/component/scaffold
```

生成物料数据：

```bash
$ iceworks generate
```

同步物料数据：

```bash
$ iceworks sync
```

## 参与贡献

欢迎通过 [issue](https://github.com/ice-lab/iceworks-cli/issues/new) 反馈问题。

如果对 `Iceworks CLI` 感兴趣，请参考 [CONTRIBUTING.md](./.github/CONTRIBUTING.md) 学习如何贡献代码。

## ICE 生态

|    Project         |    Version      |     Docs    |   Description       |
|----------------|------------------|--------------|-----------|
| [iceworks]| [![iceworks-status]][iceworks-package] | [docs][iceworks-docs] | 基于 VS Code 的多端研发套件 |
| [icejs] | [![icejs-status]][icejs-package] | [docs][icejs-docs] | 基于 React 的企业级研发框架 |
| [icestark] | [![icestark-status]][icestark-package] | [docs][icestark-docs] | 面向大型应用的微前端解决方案 |
| [icestore] | [![icestore-status]][icestore-package] | [docs][icestore-docs] | 简单友好的轻量级状态管理方案 |
| [formily] | [![formily-status]][formily-package] | [docs][formily-docs] | 能力完备性能出众的表单解决方案 |

[iceworks]: https://github.com/ice-lab/iceworks
[iceworks-status]: https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks.svg
[iceworks-package]: https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks
[iceworks-docs]: https://ice.work/docs/iceworks/about

[icejs]: https://github.com/alibaba/ice
[icejs-status]: https://img.shields.io/npm/v/ice.js.svg
[icejs-package]: https://npmjs.com/package/ice.js
[icejs-docs]: https://ice.work/docs/guide/intro

[icestark]: https://github.com/ice-lab/icestark
[icestark-status]: https://img.shields.io/npm/v/@ice/stark.svg
[icestark-package]: https://npmjs.com/package/@ice/stark
[icestark-docs]: https://ice.work/docs/icestark/guide/about

[icestore]: https://github.com/ice-lab/icestore
[icestore-status]: https://img.shields.io/npm/v/@ice/store.svg
[icestore-package]: https://npmjs.com/package/@ice/store
[icestore-docs]: https://github.com/ice-lab/icestore#icestore

[formily]: https://github.com/alibaba/formily
[formily-status]: https://img.shields.io/npm/v/@formily/react.svg
[formily-package]: https://npmjs.com/package/@formily/react
[formily-docs]: https://formilyjs.org/

## 社区

钉钉群：

<a href="https://ice.alicdn.com/assets/images/qrcode.png"><img src="https://ice.alicdn.com/assets/images/qrcode.png" width="150" /></a>

## License

[MIT](LICENSE)
