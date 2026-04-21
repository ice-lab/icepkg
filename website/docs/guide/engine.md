# 构建引擎

ICE PKG 的 Bundle 模式支持多种底层构建引擎，可以根据项目需求选择合适的引擎。

:::info
`engine` 配置项**仅对 Bundle 模式生效**，Transform 模式固定使用 Rollup 编译，不受此配置影响。
:::

## 引擎类型

| 引擎                                | 说明                                      | 适用场景                     |
| ----------------------------------- | ----------------------------------------- | ---------------------------- |
| [`rollup`](https://rollupjs.org/)   | 默认引擎，稳定性好                        | 通用场景，推荐使用           |
| [`rolldown`](https://rolldown.rs/)  | 实验性引擎，基于 Rust 实现，构建速度更快  | 追求构建速度，接受实验性风险 |
| [`rslib`](https://lib.rsbuild.dev/) | 基于 Rsbuild/Rspack，主要用于模块联邦场景 | 模块联邦（MF）构建           |

## 配置方式

通过 `bundle.engine` 或 `pkgs` 中的 `engine` 字段配置引擎：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    engine: 'rolldown', // 'rollup' | 'rolldown' | 'rslib'
  },
});
```

使用 `pkgs` 时，可以为每个产物单独指定引擎：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { module: 'esm', target: 'es2017', engine: 'rolldown' },
    { module: 'cjs', target: 'es5' }, // 使用默认引擎 rollup
  ],
});
```

## rollup（默认）

[Rollup](https://rollupjs.org/) 是 ICE PKG 的默认 Bundle 引擎，经过充分验证，稳定性好，适合大多数场景。

**注意事项**：

- Transform 模式始终使用 Rollup 编译，`engine` 配置仅对 Bundle 模式生效
- 支持 `modifyRollupOptions` 钩子来自定义 Rollup 配置

## rolldown（实验性）

[Rolldown](https://rolldown.rs/) 是基于 Rust 实现的高性能打包工具，API 与 Rollup 兼容，构建速度显著提升。

**注意事项**：

- 目前处于实验性阶段，生产环境使用需自行评估风险
- 部分 Rollup 插件可能存在兼容性问题
- `modifyRollupOptions` 钩子在 rolldown 引擎下同样生效

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    engine: 'rolldown',
    formats: ['esm', 'cjs'],
  },
});
```

## rslib

[Rslib](https://lib.rsbuild.dev/) 基于 Rsbuild/Rspack 构建，主要用于**模块联邦（Module Federation）**场景，配合 ICE PKG 的 MF 插件使用。

**注意事项**：

- 直接使用 rslib 引擎通常无需手动配置，MF 插件会自动选择该引擎
- 支持 `modifyRslibConfig` 钩子来自定义 Rslib 配置
- CSS 模块、Less、Sass 均已内置支持

更多关于模块联邦的内容，请参考[模块联邦指南](./mf)。

## 各引擎功能对比

| 功能                  | rollup |   rolldown   | rslib |
| --------------------- | :----: | :----------: | :---: |
| Transform 模式        |   ✅   |      ❌      |  ❌   |
| Bundle 模式           |   ✅   |      ✅      |  ✅   |
| 模块联邦              |   ❌   |      ❌      |  ✅   |
| 稳定性                |   高   | 中（实验性） |  高   |
| 构建速度              |  一般  |      快      | 一般  |
| `modifyRollupOptions` |   ✅   |      ✅      |  ❌   |
| `modifyRslibConfig`   |   ❌   |      ❌      |  ✅   |
