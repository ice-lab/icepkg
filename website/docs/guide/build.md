# 构建产物

本文讲述不同[构建模式](./build-modes)下的产物说明以及适用的场景。完整的产物构建配置可查看文档 [Transform 模式构建配置](../config/transform)和 [Bundle 模式构建配置](../config/bundle)。

## 构建产物说明

ICE PKG 默认支持 `esm`、`es2017`、`es2022`、`cjs`、`umd`、`mf` 六种构建产物类型。每种产物类型在不同构建模式下支持情况、模块规范、语法规范说明如下表：

| 产物类型 | Transform 模式 | Bundle 模式 |     模块规范      | 语法规范 |
| :------: | :------------: | :---------: | :---------------: | :------: |
|  `esm`   |     ✅支持     |   ✅支持    |     ES Module     |   ES5    |
| `es2017` |     ✅支持     |   ✅支持    |     ES Module     |  ES2017  |
| `es2022` |     ✅支持     |   ✅支持    |     ES Module     |  ES2022  |
|  `cjs`   |     ✅支持     |   ✅支持    |     CommonJS      |   ES5    |
|  `umd`   |    ❌不支持    |   ✅支持    |        UMD        |   ES5    |
|   `mf`   |    ❌不支持    |   ✅支持    | Module Federation |    —     |

每种构建产物的优缺点和适用场景如下表所示：

| 产物类型 | 优点                               | 缺点       | 适用场景                                                                                                           |
| :------: | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
|  `esm`   | 兼容性较好                         | 体积大     | 消费产物的应用打包时不编译 `node_modules`；或者运行环境支持的 ECMAScript 版本较低                                  |
| `es2017` | 保留大部分 JavaScript 语法，体积小 | 兼容性差   | 消费产物的应用打包时编译 `node_modules`；或者运行环境支持的 ES2017 语法。更多说明可参考[文档](./build#es2017-产物) |
| `es2022` | 保留更多新语法，体积最小           | 兼容性更差 | 运行环境明确支持 ES2022（Chrome 94+、Safari 16.4+）的场景。更多说明可参考[文档](./build#es2022-产物)               |
|  `cjs`   | 兼容各版本的 Node.js               | 体积大     | 在 Node.js 环境下运行                                                                                              |
|  `umd`   | 兼容运行在浏览器和 Node.js 中      | 体积大     | 用户的项目中某个依赖 external，需要在 HTML 中通过 `<script />` 引入 UMD 产物；或者在浏览器中直接使用产物           |

## 配置产物输出

推荐使用 `pkgs` 配置多个构建单元，每个 pkg 独立控制模块格式、语法目标、入口、输出目录等。

**基础用法**：直接传入预设字符串，快速输出对应格式产物。字符串前缀 `!` 表示使用 Bundle 模式构建，不带 `!` 则使用 Transform 模式：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // esm → Transform 模式 esm+es5 产物
  // es2017 → Transform 模式 esm+es2017 产物
  // cjs → Transform 模式 cjs+es5 产物
  // !umd → Bundle 模式 umd 产物（! 前缀表示 Bundle 模式）
  pkgs: ['esm', 'es2017', 'cjs', '!umd'],
});
```

**完整配置**：通过对象形式精确控制每个产物的输出：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { module: 'esm', target: 'es2017', outputDir: 'es2017' },
    { module: 'esm', target: 'es5', outputDir: 'esm' },
    { module: 'cjs', target: 'es5', outputDir: 'cjs' },
  ],
});
```

**差异化配置**：不同产物使用不同的入口或配置，互不干扰：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    // browser 端产物，入口不同，需要 external react
    {
      id: 'browser',
      module: 'esm',
      target: 'es2017',
      entry: './src/index.browser.ts',
      externals: { react: 'React' },
    },
    // node 端产物，CJS 格式
    {
      id: 'node',
      module: 'cjs',
      target: 'es2017',
      entry: './src/index.node.ts',
    },
  ],
});
```

**通过 `extends` 复用配置**：抽取公共配置，避免重复：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    // 定义基础配置
    {
      id: 'base',
      module: 'esm',
      target: 'es2017',
      externals: { react: 'React', 'react-dom': 'ReactDOM' },
    },
    // 继承 base，只覆盖 outputDir
    { extends: ['base'], outputDir: 'es2017' },
    // 继承 base，修改 target
    { extends: ['base'], target: 'es5', outputDir: 'esm' },
  ],
});
```

**动态禁用某个产物**：通过 `disable` 结合环境变量按需开关某个 pkg：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { module: 'esm', target: 'es2017' },
    // 仅在需要时构建 UMD 产物
    { bundle: true, module: 'umd', disable: !process.env.BUILD_UMD },
  ],
});
```

**为某个产物单独添加插件**：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { module: 'esm', target: 'es2017' },
    {
      module: 'esm',
      target: 'es5',
      // 仅对此 pkg 生效的插件
      plugins: ['./my-legacy-plugin.mjs'],
    },
  ],
});
```

完整配置项说明请参考 [pkgs 配置项](../config/pkgs)。

### 兼容模式

对于从 v1 迁移的项目，也可以通过 `transform.formats` 或 `bundle.formats` 指定输出格式，两者在内部会自动转换为等价的 `pkgs` 条目：

- `transform.formats` 中的每个格式直接作为 `pkgs` 的 preset 字符串
- `bundle.formats` 中的每个格式加 `!` 前缀后追加到 `pkgs`

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['esm', 'es2017'], // 等价于 pkgs: ['esm', 'es2017']
  },
  bundle: {
    formats: ['umd'], // 等价于 pkgs: [..., '!umd']
  },
});
```

若 `pkgs`、`transform.formats`、`bundle.formats` 同时配置，三者会合并（字符串 preset 自动去重）：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

// 最终等价于 pkgs: ['cjs', 'esm', '!umd']
export default defineConfig({
  pkgs: ['cjs'],
  transform: { formats: ['esm'] },
  bundle: { formats: ['umd'] },
});
```

:::tip
若三者均未配置，默认输出 `pkgs: ['esm']`（ES Module + ES5 产物）。
:::

## 默认构建产物

ICE PKG 默认输出一份 ES Module + ES5 语法的产物（即 `esm` 预设），等价于：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: ['esm'],
});
```

执行 `npm run build` 命令后，得到以下的构建产物：

```md
── esm
| ├── index.d.ts
| └── index.js
```

输出构建目录名和构建产物类型一一对应。

## 语法目标（target）说明

ICE PKG 支持三种语法编译目标，控制编译器保留或降级哪些 JavaScript 语法：

|  target  | 保留的语法特性（不降级）                                                                                                                                 | 最低浏览器要求                              | 参考                                                                                                                                                                                                                                                                                             |
| :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  `es5`   | 无，所有现代语法均降级为 ES5                                                                                                                             | Chrome 49、IE 11                            | —                                                                                                                                                                                                                                                                                                |
| `es2017` | 箭头函数、Class、`async`/`await`、解构、展开运算符、模板字符串、`for...of`、`Promise`、`Object.entries/values` 等                                        | Chrome 61、Safari 11、Firefox 60、Edge 16   | [compat-table](https://compat-table.github.io/compat-table/es2016plus/) / [caniuse](https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions) |
| `es2022` | 在 ES2017 基础上，额外保留：class 私有字段（`#field`）、class static blocks、`Array/String.at()`、`Object.hasOwn()`、top-level `await`、`Error` cause 等 | Chrome 94、Safari 16.4、Firefox 93、Edge 94 | [compat-table](https://compat-table.github.io/compat-table/es2016plus/)                                                                                                                                                                                                                          |

## ES2017 产物

ICE PKG 支持额外输出 ES2017 规范的 [Modern 产物](https://web.dev/publish-modern-javascript/)。这份产物在编译时会保留大部分的 JavaScript 语法特性（Class、箭头函数、async/await、解构、spread 运算符等），可以运行在[大部分的现代浏览器版本](https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions)上（市场份额 > 95%）。当网站不再转译这些语法时，文件的字节数得以大幅减少，从而极大地改善脚本加载性能。

以一个简单的 React 组件为例，ES2017 产物与 ES5 产物的大小对比：

| 产物        | 大小 |
| ----------- | ---- |
| ES2017 产物 | 1.8k |
| ES5 产物    | 3.7k |

:::tip
传统的 NPM 包开发中，大量的代码仍被编译到 ES5 语法。若你想计算你的网站在使用 ES2017 产物后可实现的产物大小和性能改进，可以试试 [estimator.dev](https://estimator.dev/) 这个工具。
:::

如果你确定你的运行环境支持 ES2017，推荐使用以下的配置仅生成体积更小的构建产物：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // Transform 模式仅输出 es2017 产物
  // !es2017 表示 Bundle 模式输出 esm+es2017 产物
  pkgs: ['es2017', '!es2017'],
});
```

构建产物如下：

```md
── es2017
| ├── index.d.ts
| └── index.js
├── dist
| └── index.esm.es2017.production.js
```

## ES2022 产物

ES2022 产物在 ES2017 的基础上，进一步保留了更多较新的语法特性（class 私有字段、class static blocks、`Array.at()`、top-level await 等），产物体积更小，但要求运行环境支持 ES2022（Chrome 94+、Safari 16.4+、Firefox 93+）。

如果你的运行环境明确支持 ES2022，可以使用以下配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: ['es2022'],
});
```

构建产物如下：

```md
── es2022
| ├── index.d.ts
| └── index.js
```

## ES Module 和 CommonJS 产物

这种场景下是针对要生成运行在 Node.js 环境下的产物。如果你的产物需要兼容低版本 Node.js (v12.20.0 以下)，则还是需要生成 CommonJS 产物，否则可以直接使用 ES Module 的产物。

:::tip
不同版本的 Node.js 支持的 ECMAScript 语法可参考 [Node Green 网站](https://node.green/)。
:::

由于 Node 12.20.0 支持 ES Module 和所有的 ES2017 的语法。因此推荐以下的配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // cjs → Transform 模式 cjs+es5 产物
  // es2017 → Transform 模式 esm+es2017 产物
  // !cjs → Bundle 模式 cjs+es5 产物
  // !es2017 → Bundle 模式 esm+es2017 产物
  pkgs: ['cjs', 'es2017', '!cjs', '!es2017'],
});
```

执行 `npm run build` 后输出的产物如下：

```md
── cjs
| ├── index.d.ts
| └── index.js
├── es2017
| ├── index.d.ts
| └── index.js
├── dist
| ├── index.cjs.es5.production.js
| └── index.esm.es2017.production.js
```

其中，`cjs` 目录和 `es2017` 目录是 Transform 构建模式的产物；`dist` 目录是 Bundle 构建模式的产物。

| 产物类型 | 模块规范  | 语法规范 |
| :------: | --------- | -------- |
|  es2017  | ES Module | ES2017   |
|   cjs    | CommonJS  | ES5      |

然后在 `package.json` 中配置 `exports` 产物导出：

```json
{
  "exports": {
    ".": {
      "import": "./es2017/index.js",
      "require": "./cjs/index.js",
      "default": "./cjs/index.js"
    }
  }
}
```

## UMD 产物

一般情况下，[前端类库](./scenario/library)的场景需要打包构建生成 UMD 产物。

ICE PKG 仅支持在 [Bundle 模式](./build-modes#bundle-模式)下构建出 UMD 产物，配置方式如下：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    {
      bundle: true,
      module: 'umd',
      name: 'my-library', // 配置 umd 模块导出的名字，通过 `window[name]` 访问
    },
  ],
});
```

执行 `npm run build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```

如果需要额外输出一份未压缩的 UMD 产物以方便调试构建，可以新增 `modes` 配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    {
      bundle: true,
      module: 'umd',
      name: 'my-library',
    },
  ],
  bundle: {
    modes: ['production', 'development'],
  },
});
```

执行 `npm run build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.development.css
├── index.umd.es5.development.js
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```

## 模块联邦产物

模块联邦（Module Federation）产物用于微前端架构下的跨应用模块共享场景，需配合 [`@ice/pkg-plugin-mf`](./mf) 插件使用，详见[模块联邦指南](./mf)。
