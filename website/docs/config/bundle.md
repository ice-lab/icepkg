# bundle

该字段定义 [Bundle 模式](../guide/build-modes#bundle-模式) 下额外的配置，若开启，默认生成 `dist` 文件目录。

## formats

:::tip
推荐使用 [`pkgs`](./pkgs) 替代 `formats` 来配置多产物输出，`pkgs` 提供更灵活的差异化配置能力。
:::

- 类型：`['esm', 'umd', 'cjs', 'es2017']`
- 默认值：`['esm', 'es2017']`

输出的类型，默认是输出 `esm` 和 `es2017` 产物。

```shell title=root/dist
- index.esm.es5.production.js        # 输出 ES module + es5 产物
- index.esm.es2017.production.js     # 输出 ES module + es2017 产物
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
- index.umd.es5.production.js        # 输出 umd + es5 产物
- index.umd.es2017.production.js     # 输出 umd + es2017 产物
```

注意，如果需要打包生成 umd 规范产物，不能够配置多个 entry（入口），否则会报错 `Error: Invalid value "umd" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.`

cjs 规范产物同理将 `formats` 配置为 `['cjs', 'es2017']` 即可。

:::tip
Bundle 模式的 formats 如果单独配置 `['es2017']` 将不会生效，因为其仅决定产物语法层面规范，而无法决定产物的模块规范。因此其必须与 `'esm'`、`'umd'` 和 `'cjs'` 中的至少一项搭配配置才能正常生成对应模块规范的 ES2017 产物。
:::

## modes

- 类型：`Array<'development' | 'production'>`
- 默认值：`['production']`

指定输出的产物是否经过压缩。默认情况下输出的产物是压缩过的。

```shell title="root/dist"
- index.esm.es5.production.js        # 输出 ES module + es5 产物
- index.esm.es2017.production.js     # 输出 ES module + es2017 产物
```

增加 `'development'` 时，会额外输出一份**未压缩的**的产物，这也意味着用户可以在开发态使用该产物获得更多的开发时信息。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    modes: ['production', 'development'],
  },
});
```

```shell title="root/dist"
- index.esm.es5.development.js        # 输出未压缩产物（ES module + es5）
- index.esm.es5.production.js         # 输出压缩产物 (ES module + es5)
- index.esm.es2017.development.js     # 输出未压缩产物 （ES module + es2017）
- index.esm.es2017.production.js      # 输出压缩产物 (ES module + es2017)
```

## name

- 类型：`string`
- 默认值：`package.name`

library 导出的名称，可以通过 `window[name]` 访问，一般配合打包 `umd` 产物时使用。默认值为 `package.json` 配置的 `name` 字段。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    name: 'ICEPKG',
  },
});
```

## externals

- 类型：`boolean | Record<string, string> | (string | RegExp | Record<string, string>)[]`
- 默认值：`false`

默认情况下，bundle 的产物包含所有依赖产物。该选项可修改这一结果。

若想要 Bundle 不包含依赖产物，可以传入 `true`，其会解析 `package.json` 并将所有依赖 external 掉，包括 node 的依赖。适合针对 Node 环境的构建。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: true,
  },
});
```

若想要自定义配置 externals，则可以直接传入想要 external 的依赖，支持字符串和正则表达式。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: ['react', 'react-dom', /^@ice($|\/)/],
  },
});
```

如果你选择构建 umd 格式，默认情况下会根据一定的规则生成从全局对象上获取依赖的名字，如果你想自定义，则可以直接传入一个对象来配置。

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

## minify

- 类型：`boolean | { js?: boolean | ((mode: string, command: string) => boolean | { options?: swc.JsMinifyOptions }); css?: boolean | ((mode: string, command: string) => boolean | { options?: cssnano.Options });}`
- 默认值：build 阶段且 mode 是 `production` 时为 `true`，否则为 `false`

是否压缩 JS 和 CSS 资源。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    // production 产物和 development 产物不压缩
    minify: false,
    // 修改 JS 和 CSS 压缩参数
    minify: {
      js: (mode, command) => ({
        options: {
          /* */
        },
      }),
      css: (mode, command) => ({
        options: {
          /* */
        },
      }),
    },
  },
});
```

## polyfill

- 类型：`false | 'entry' | 'usage'`
- 默认值：`false`

配置处理 polyfill 的逻辑。不同值的含义：

- `false`: 不引入任何 polyfill
- `'entry'`: 根据配置的 format 值在每个文件开头都引入对应的 polyfill
- `'usage'`: 根据源码中使用到的代码按需引入 polyfill

## compileDependencies

- 类型：`boolean | RegExp[] | string[]`
- 默认值：`false`

配置是否编译 node_modules 中的依赖。如果值为 `true`，则 node_modules 中的依赖都会编译；如果值为 false 则都不编译；如果值为数组，则只会编译对应的依赖。

```js title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    compileDependencies: ['antd'],
  },
});
```

## browser

- 类型: `boolean`
- 默认值: `false`

配置解析 Node 模块的时候，是否优先读取 package.json 中的 `browser` 字段。如果你的模块**只运行**在浏览器端，可以开启此选项只 bundle 浏览器相关的代码。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    browser: true,
  },
});
```

## codeSplitting

- 类型：`boolean`
- 默认值：`true`

是否开启代码分割。Bundle 模式默认启用，会将 `node_modules` 中的公共依赖提取到 `vendor` chunk，多入口之间的共享模块也会被提取。

若关闭代码分割，所有模块将合并输出为单一文件，适合对产物结构有严格要求的场景（如 UMD 发布）：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    codeSplitting: false,
  },
});
```

:::tip
UMD 格式由于 Rollup 限制，已默认启用 `inlineDynamicImports`，分包设置对 UMD 产物不生效。
:::
