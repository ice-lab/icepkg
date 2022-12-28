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

+ `build.config.mts`
+ `build.config.mjs`
+ `build.config.ts`
+ `build.config.js`
+ `build.json`

## 完整配置项

### alias

+ 类型：`Record<string, string>`
+ 默认值：`{}`

比如，将 `@` 指向 `./src` 目录。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  alias: {
    '@': './src',
  },
});
```

然后代码里 `import '@/foo'` 会被改成 `import '/path/to/your/project/foo'`。

### define

+ 类型：`Record<string, string | boolean | number | object | null>`
+ 默认值：`{ __DEV__: 'true' | 'false', 'process.env.NODE_ENV': '"development"' | '"production"' }`

定义编译时环境变量，会在编译时被替换。注意：属性值会经过一次 `JSON.stringify` 转换。

例如，希望在代码中注入版本号，用全局变量 `__VERSION__` 来替代：

```ts title="build.config.mts"
import fs from 'fs';
import { defineConfig } from '@ice/pkg';

const packageJSONContent = fs.readFileSync('./package.json', 'utf-8');
const version = JSON.parse(packageJSONContent).version;

export default defineConfig({
  define: {
    '__VERSION__': version,
  },
});
```

在编译时，所有 `__VERSION__` 都会被替换为项目的版本号。

:::tip

在 TS 项目中，需要在 `typings.d.ts` 或其他类型声明文件中，声明 `define` 所设置的属性，以便通过类型检查，并获得类型提示。比如：

```ts title=typings.d.ts
declare const __VERSION__: string
```
:::

ICE PKG 默认注入了 `__DEV__` 全局变量，用于标识开发态环境。这个变量在输出一些仅在 development 环境的信息时非常有用。比如，输出在用户开发态才显示的警告信息。

```ts title=index.ts
if (__DEV__) {
  console.warn('请注意，这可能会产生错误！');
}
```

:::info 发生了什么？
实际上，在编译时，`__DEV__` 会被替换为 `process.env.NODE_ENV !== 'production'`。
:::

### sourceMaps

+ 类型：`boolean | 'inline'`
+ 默认值：start 阶段默认为 `true`，build 阶段默认为 `false`

是否生成 sourcemap，这在代码调试的时候非常有用。

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: true,
});
```

这会为所有产物额外输出 `.js.map` 文件。如果你想要 `inline` sourcemap，可将选项配置为 `inline`。

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',
});
```

### generateTypesForJs

+ 类型：`boolean`
+ 默认值：`false`

为 JavaScript 代码生成类型文件。ICE PKG 默认为文件后缀为 `.ts` 生成类型文件。

如果使用 [JSDoc](https://jsdoc.app/) 为 JavaScript 生成了类型注解，该配置会非常有效。详细介绍 [工程能力 - 生成类型文件](./abilities#生成类型文件)。

### plugins

+ 类型：`Array<string | [string, any?]>`
+ 默认值：`[]`

配置额外的 ICE PKG 插件。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    // npm 依赖
    '@ice/plugin-docusaurus',
    // 相对路径
    './customPlugin.mjs',
    // 指定插件选项
    ['@ice/plugin-docusaurus', { title: 'Hello World' }]
  ],
});
```

ICE PKG 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统。更多内容请参考 [插件开发](../plugins-development)。

### transform

该字段定义 [transform 模式](../#双模式) 下额外的配置。包含以下配置：

:::tip
transform 模式是 ICE PKG 默认的编译模式。
:::

#### entry

+ 类型：`string`
+ 默认值：`./src`

指定源代码目录。该目录下的文件会逐一被编译到输出目录。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transfrom: {
    entry: './components',
  },
});
```

#### formats

+ 类型：`Array<'cjs' | 'esm' | 'es2017'>`
+ 默认值：`['esm', 'es2017']`

输出的类型。ICE PKG 会默认把产物输出到 `esm` (输出 ES module + ES5 产物) 和 `es2017` (输出 ES module + ES2017 产物) 两个文件夹。

```shell
- esm    # ES module + ES5 产物
- es2017 # ES module + ES2017 产物
```

若想要输出 CommonJS 产物，可如下配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['cjs', 'esm', 'es2017'],
  },
});
```

则输出如下文件夹：

```shell
- cjs    # CommonJS + ES5 产物
- esm    # ES module + ES5 产物
- es2017 # ES module + ES2017 产物
```

#### excludes

+ 类型：`string | string[]`
+ 默认值：`undefined`

排除无需编译的文件。比如，我们不想编译 `src` 下的所有测试文件，其中测试文件包含在 `__tests__` 目录下，或以 `*.test.[j|t]s` 结尾。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transfrom: {
    excludes: ['**/__tests__/**', '*.test.[j|t]s'],
  },
});
```

`excludes` 的配置完全遵循 [minimatch](https://github.com/isaacs/minimatch) 写法。

### bundle

该字段定义 [bundle 模式](../#双模式) 下额外的配置，若开启，默认生成 `dist` 文件目录。`bundle` 包含以下配置：

#### entry

+ 类型：`rollup.InputOption`
+ 默认值：`'./src/index'`

指定 bundle 模式下的构建入口。支持配置单入口或者多个入口。

指定单个入口：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    // 指定
    entry: './src/index',
  },
});
```

指定多个入口：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    // 数组形式
    entry: ['./src/foo', './src/bar'],
    // 对象形式，key 值作为 chunk name
    entry: {
      foo: './src/foo',
      bar2: './src/bar'
    }
  },
});
```

#### formats

+ 类型：`['esm', 'umd', 'cjs', 'es2017']`
+ 默认值：`['esm', 'es2017']`

输出的类型，默认是输出 `esm` 和 `es2017` 产物。

```shell title=root/dist
- index.production.js        # 输出 ES module + es5 产物
- index.es2017.production.js # 输出 ES module + es2017 产物
```

若只需要产出 umd 规范产物，可配置为：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd', 'es2017'],
  },
});
```

则输出以下产物：

```shell title=root/dist
- index.umd.production.js        # 输出 umd + es5 产物
- index.umd.es2017.production.js # 输出 umd + es2017 产物
```

注意，如果需要打包生成 umd 规范产物，不能够配置多个 entry（入口），否则会报错 `Error: Invalid value "umd" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.`

cjs 规范产物同理将 `formats` 配置为 `['cjs', 'es2017']` 即可。

:::tip
bundle 模式的 formats 如果单独配置 `['es2017']` 将不会生效，因为其仅决定产物语法层面规范，而无法决定产物的模块规范。因此其必须与 `'esm'`、`'umd'` 和 `'cjs'` 中的至少一项搭配配置才能正常生成对应模块规范的 ES2017 产物。
:::

#### modes

+ 类型：`Array<'development' | 'production'>`
+ 默认值：`['production']`

指定输出的产物是否经过压缩。默认情况下输出的产物是压缩过的。

```shell title="root/dist"
- index.production.js        # 输出 ES module + es5 产物
- index.es2017.production.js # 输出 ES module + es2017 产物
```

增加 `'development'` 时，会额外输出一份**未压缩的**的产物，这也意味着用户可以在开发态使用该产物获得更多的开发时信息。在开发 Library 时，这将会非常有作用。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    modes: ['production', 'development'],
  },
});
```

```shell title="root/dist"
- index.development.js        # 输出未压缩产物（ES module + es5）
- index.production.js         # 输出压缩产物 (ES module + es5)
- index.es2017.development.js # 输出未压缩产物 （ES module + es2017）
- index.es2017.production.js  # 输出未压缩产物 (ES module + es2017)
```

#### name

+ 类型：`string`
+ 默认值：`package.name`

library 导出的名称，可以通过 `window[name]` 访问，一般配合打包 `umd` 产物时使用。默认值为 `package.json` 配置的 `name` 字段。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    name: 'ICEPKG'
  },
});
```

#### externals

+ 类型：`boolean | Record<string, string>`
+ 默认值：`true`

默认情况下，bundle 的产物包含所有依赖产物。该选项可修改这一结果。若想要 bundle 不包含依赖产物，可如下配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: true,
  },
});
```

若想要自定义配置 externals，参考如下配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
});
```

#### minify

+ 类型：`boolean`
+ 默认值：start 阶段为 `false`，build 阶段为 `true`

是否压缩 JS 和 CSS 资源。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    minify: false,
  },
});
```
#### development（已废弃，请使用 modes）

+ 类型：`boolean`
+ 默认值：`false`

若开启该选项，则会额外输出一份 **未压缩的** 的产物，这也意味着用户可以在开发态使用该产物获得更多的开发时信息。在开发 Library 时，这将会非常有作用。

```js title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    development: true,
  },
});
```

上述配置会输出如下产物：

```shell title=root/dist
- index.development.js        # 输出未压缩产物（ES module + es5）
- index.production.js         # 输出压缩产物 (ES module + es5)
- index.es2017.development.js # 输出未压缩产物 （ES module + es2017）
- index.es2017.production.js  # 输出未压缩产物 (ES module + es2017)
```
