# 构建配置

## 配置文件

若希望对 ICE PKG 的能力进行配置，推荐在项目根目录中添加名为 `build.config.mts` 的配置文件：

```ts title=build.config.mts
import { defineConfig } from '@ice/pkg';

// 使用 defineConfig 工具函数以获得更好的类型提示
export default defineConfig({
  // 配置选项
});
```

注：ICE PKG 支持的配置文件类型包括：

- `build.config.mts`
- `build.config.mjs`
- `build.config.ts`
- `build.config.js`

## 配置项总览

| 配置项                       | 说明                    |
| ---------------------------- | ----------------------- |
| [entry](./entry)             | 构建入口                |
| [alias](./alias)             | 路径别名                |
| [define](./define)           | 编译时环境变量          |
| [sourceMaps](./source-maps)  | 是否生成 sourcemap      |
| [jsxRuntime](./jsx-runtime)  | JSX 转换方式            |
| [plugins](./plugins)         | 插件配置                |
| [helpers](./helpers)         | SWC helper 函数处理方式 |
| [server](./server)           | 内置预览服务器配置      |
| [declaration](./declaration) | 类型文件生成配置        |
| [transform](./transform)     | Transform 模式配置      |
| [bundle](./bundle)           | Bundle 模式配置         |
| [pkgs](./pkgs)               | 多构建单元配置          |
