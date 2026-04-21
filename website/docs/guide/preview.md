# 文档预览

开发组件库时，通常需要本地预览组件效果并编写文档，可以选择社区中的文档站点工具。以下是一些支持 React 组件预览的推荐工具：

- [Storybook](https://storybook.js.org/) — 业界最流行的组件开发工具，支持交互式预览和文档编写
- [Docusaurus](https://docusaurus.io/) — Meta 出品的文档站点框架，支持 MDX，可嵌入 React 组件
- [Rspress](https://rspress.dev/) — 基于 Rspack 的高性能文档框架，支持 MDX 和 React 组件预览
- [Dumi](https://d.umijs.org/) — 面向组件库的文档工具，内置组件 Demo 预览能力

## 注意事项

文档工具在预览组件时直接运行源码，而非构建产物，因此需要将 `build.config.mts` 中的相关配置同步到文档工具的构建配置中。

### alias

如果配置了路径别名，需要在文档工具的构建配置中同步设置。以 Storybook 为例：

```ts title=".storybook/main.ts"
import { mergeConfig } from 'vite';

export default {
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@': '/src',
        },
      },
    }),
};
```

### define

ICE PKG 默认注入了 `__DEV__`、`process.env.NODE_ENV` 等编译时变量，文档工具运行源码时这些变量不会被自动替换，需要显式定义。以 Storybook 为例：

```ts title=".storybook/main.ts"
import { mergeConfig } from 'vite';

export default {
  viteFinal: (config) =>
    mergeConfig(config, {
      define: {
        __DEV__: true,
      },
    }),
};
```

如果你配置了自定义的 `define`，同样需要在文档工具中补充对应的定义。

### jsxRuntime

ICE PKG 默认使用 `automatic` 模式转换 JSX，即自动从 `react/jsx-runtime` 引入转换函数，无需在每个文件中手动 `import React`。大多数文档工具默认也使用 `automatic` 模式，通常无需额外配置。

如果你将 `jsxRuntime` 改为 `classic`，需要在文档工具中同步配置。以 Storybook 为例：

```ts title=".storybook/main.ts"
import { mergeConfig } from 'vite';

export default {
  viteFinal: (config) =>
    mergeConfig(config, {
      esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
      },
    }),
};
```

---

以上配置方式以 Storybook（基于 Vite）为例，其他工具的具体写法请参考各自的官方文档。
