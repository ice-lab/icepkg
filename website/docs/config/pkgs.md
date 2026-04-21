# pkgs

`@ice/pkg` 2.0 引用的新式配置方式

- 类型：`Array<PresetPkg | PkgUserConfig | boolean | undefined>`
- 默认值：`undefined`

配置多个构建单元（package），每个 pkg 可以独立控制构建模式、格式、入口、输出目录等。适用于需要同时输出多种格式或多个子包的场景。

## PresetPkg（预设格式）

最简单的用法是直接传入预设格式字符串，快速开启对应产物：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: ['esm', 'cjs', '!umd'],
});
```

支持的预设值：

- Transform 格式（直接字符串）：`'esm'`、`'cjs'`、`'es2017'`
- Bundle 格式（以 `!` 为前缀）：`'!esm'`、`'!cjs'`、`'!es2017'`、`'!umd'`、`'!mf'`

## PkgUserConfig 配置项

### id

- 类型：`string`

当前 pkg 的唯一标识，可在其他 pkg 的 `extends` 中引用。

### module

- 类型：`'esm' | 'cjs' | 'umd' | 'mf'`
- 默认值：`'esm'`

产物的模块规范：

- `'esm'`：输出 ES Module 格式，使用 `import/export` 语法，对 Tree-Shaking 友好，适合被打包工具消费的组件库或工具库
- `'cjs'`：输出 CommonJS 格式，使用 `require/module.exports`，兼容所有版本的 Node.js，适合 Node 模块
- `'umd'`：输出 UMD 格式，同时兼容 ESM、CJS 和浏览器全局变量，适合需要通过 `<script>` 直接引入的前端类库，需配合 `bundle: true` 使用
- `'mf'`：输出 Module Federation 格式，用于跨应用共享模块，需配合 `bundle: true` 及相关插件使用，详见 [Module Federation](../guide/mf)

### target

- 类型：`'es5' | 'es2017' | 'es2022'`
- 默认值：`'es5'`

产物的 JavaScript 语法目标版本，决定编译器会将哪些语法降级处理：

- `'es5'`：将所有现代语法（箭头函数、class、async/await 等）编译为 ES5，兼容性最好，但产物体积最大，适合需要兼容旧版浏览器的场景
- `'es2017'`：保留 async/await、箭头函数、class、解构等大部分现代语法，不做降级，可运行在市场份额 > 95% 的现代浏览器上，产物体积更小。详见 [ES2017 产物](../guide/build#es2017-产物)
- `'es2022'`：保留更多新语法（如顶层 await、class 私有字段等），产物体积最小，仅适合运行环境明确支持 ES2022 的场景

### bundle

- 类型：`boolean`
- 默认值：`false`

是否使用 Bundle 模式构建。`false` 为 Transform 模式（逐文件编译），`true` 为 Bundle 模式（打包）。

### outputDir

- 类型：`string`

指定该 pkg 的产物输出目录，覆盖默认目录。

### entryRoot

- 类型：`string`

Transform 模式下输出路径的相对根目录，优先级高于全局 [`transform.entryRoot`](./transform#entryroot)。

### extends

- 类型：`Array<PresetPkg | string>`

继承其他 pkg 的配置，值为 PresetPkg 字符串或其他 pkg 的 `id`。注意，不能引入循环，否则会报错

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { id: 'base', module: 'esm', entry: './src/index.ts' },
    { extends: ['base'], module: 'cjs', outputDir: 'cjs' },
  ],
});
```

### plugins

- 类型：`Array`

仅对当前 pkg 生效的插件，不影响其他 pkg。与全局 [`plugins`](./plugins) 用法相同。

### disable

- 类型：`boolean`

禁用该 pkg，构建时跳过。可以在不改动配置的情况下，通过环境变量或者其他变量进行控制。

---

以下配置项含义与对应的顶层或 bundle 配置相同，在 pkg 中配置时会按优先级覆盖全局配置，仅作用于当前 pkg：

| 配置项                | 同                                                         | 说明                  |
| --------------------- | ---------------------------------------------------------- | --------------------- |
| `entry`               | [entry](./entry)                                           | 构建入口              |
| `alias`               | [alias](./alias)                                           | 路径别名              |
| `define`              | [define](./define)                                         | 编译时环境变量        |
| `sourceMaps`          | [sourceMaps](./source-maps)                                | 是否生成 sourcemap    |
| `jsxRuntime`          | [jsxRuntime](./jsx-runtime)                                | JSX 转换方式          |
| `declaration`         | [declaration](./declaration)                               | 类型文件生成配置      |
| `helpers`             | [helpers](./helpers)                                       | SWC helper 处理方式   |
| `externals`           | [bundle.externals](./bundle#externals)                     | 外部依赖              |
| `name`                | [bundle.name](./bundle#name)                               | UMD 导出名称          |
| `compileDependencies` | [bundle.compileDependencies](./bundle#compiledependencies) | 是否编译 node_modules |
| `polyfill`            | [bundle.polyfill](./bundle#polyfill)                       | polyfill 处理方式     |
| `minify`              | [bundle.minify](./bundle#minify)                           | 是否压缩产物          |
| `engine`              | [engine](../guide/engine)                                  | 构建引擎（实验性）    |
| `codeSplitting`       | `boolean`，默认 `true`                                     | 是否开启代码分割      |
