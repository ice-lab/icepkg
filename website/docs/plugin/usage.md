# 使用插件

ICE PKG 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统，通过插件可以极大地扩展 ICE PKG 的构建能力。

## 配置插件

在 `build.config.mts` 中通过 [`plugins`](../config/plugins) 配置项引入插件：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    // 从 npm 安装的插件
    '@ice/plugin-docusaurus',
    // 本地插件（相对路径）
    './my-plugin.mjs',
    // 带选项的插件
    ['@ice/plugin-docusaurus', { title: 'My Docs' }],
  ],
});
```

部分插件支持通过 `import` 引入后使用，可以提供更好的类型提示能力，例如：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';
import myPlugin from 'my-plugin';

export default defineConfig({
  plugins: [myPlugin({ foo: 'bar' })],
});
```

两种用法的区别在于插件的导出形式。使用前请仔细阅读插件文档，确认插件支持哪种引入方式。

## 本地插件

如果只需要在当前项目中使用，可以直接创建本地插件文件，通过相对路径引入：

```js title="my-plugin.mjs"
/**
 * @type {import('@ice/pkg').Plugin}
 */
const plugin = (api, options) => {
  // 在这里编写插件逻辑
  console.log('plugin options:', options);
};

export default plugin;
```

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [['./my-plugin.mjs', { foo: 'bar' }]],
});
```

## pkg 级别插件

通过 [`pkgs`](../config/pkgs) 配置的每个构建单元也支持独立配置插件，仅对当前 pkg 生效：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    {
      module: 'esm',
      plugins: ['./esm-only-plugin.mjs'],
    },
  ],
});
```

:::caution
插件通常只支持其中一种作用域，混用可能导致行为异常。在使用插件前，请查阅插件文档确认其支持的作用域：

- **仅支持全局**：只能配置在顶级 `plugins` 中，例如文档类插件（`@ice/plugin-docusaurus`）需要注册全局构建钩子，放到 `pkgs[].plugins` 中会不生效
- **仅支持 pkg 级别**：只能配置在 `pkgs[].plugins` 中，放到顶级 `plugins` 中会不生效
- **两者均支持**：可在两处配置，插件内部会通过 `pluginScope` 区分当前运行环境
  :::
