# 模块联邦

ICE PKG 提供了 `@ice/pkg-plugin-mf` 插件来支持模块联邦 (Module Federation) 构建，使你能够构建适用于微前端架构的组件或应用。

> 底层使用了 [rslib](https://rslib.rs) 作为 mf 构建器，所以会导致行为和普通构建行为有异常，请注意

## 安装

首先，你需要安装模块联邦插件：

```bash
npm install @ice/pkg-plugin-mf -D
```

## 基本用法

在 `build.config.mts` 中配置模块联邦构建：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';
import { mf } from '@ice/pkg-plugin-mf';

export default defineConfig({
  pkgs: [
    {
      module: 'mf', // 指定构建格式为模块联邦
      target: 'es2017', // 目标语法版本
      bundle: true, // 启用打包模式
      engine: 'rslib', // 使用 RSLib 作为构建引擎
      plugins: [
        mf({
          name: 'my_remote', // 模块联邦远程名称
          exposes: {
            '.': './src/index.ts', // 暴露主入口
            './Counter': './src/Counter.tsx', // 暴露其他组件
            './App': './src/App.tsx', // 暴露 App 组件
          },
          getPublicPath: 'return "http://localhost:4444/"', // 指定公共路径
          shared: {}, // 共享依赖配置
        }),
      ],
    },
  ],
});
```

## 配置选项

模块联邦插件接受所有 `@module-federation/rsbuild-plugin` 的配置选项，详情请查看 [Module Federation 官方文档](https://module-federation.io/)。

## Tips

- 如果通过配置 `outputDir` 修改输出目录，需同步更新宿主应用中消费微模块产物的路径
- 可以通过 `server: true` 开启本地预览服务调试微模块产物

## 注意事项

1. **指定入口文件**: 由于 `rslib` 的限制，必须指定准确的入口文件，例如 `./src/index.ts`，不能是 `./src/index`。
1. **依赖处理**: 当使用模块联邦构建时，通常需要将 React、React DOM 等基础依赖配置为外部依赖，避免重复打包。
1. **样式处理**: 模块联邦构建支持 CSS、Less、Sass 等样式文件的处理，样式会被提取到单独的 CSS 文件中。
1. **类型定义**: 构建会自动生成类型定义文件，存放在 `dist/@mf-types/` 目录下。
1. **运行时兼容性**: 确保宿主应用和微应用的共享依赖版本兼容，以避免运行时冲突。
