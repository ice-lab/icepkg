# 构建产物

本文讲述不同[构建模式](./abilities#双模式构建)下的产物说明以及适用的场景。完整的产物构建配置可查看文档 [Transform 模式构建配置](../reference/config#transform)和 [Bundle 模式构建配置](../reference/config#bundle)。


## 构建产物说明

ICE PKG 默认支持 `esm`、`es2017`、`cjs`、`umd` 四种构建产物类型。每种产物类型在不同构建模式下支持情况、模块规范、语法规范说明如下表：

| 产物类型 | Transform 模式 | Bundle 模式 | 模块规范  | 语法规范 |
| :------: | :------------: | :---------: | :-------: | :------: |
|   `esm`    |     ✅支持      |    ✅支持    | ES Module |   ES5    |
|  `es2017`  |     ✅支持      |    ✅支持    | ES Module |  ES2017  |
|   `cjs`    |     ✅支持      |    ✅支持    | CommonJS  |   ES5    |
|   `umd`    |    ❌不支持     |    ✅支持    |    UMD    |   ES5    |

每种构建产物的优缺点和适用场景如下表所示：

| 产物类型 | 优点 | 缺点 | 适用场景 |
| :-------: | ---- | ---- | --------- |
|   `esm`    | 兼容性较好 | 体积大 | 消费产物的应用打包时不编译 `node_modules`；或者运行环境支持的 ECMAScript 版本较低 |
| `es2017` | 保留大部分 JavaScript 语法，体积小 | 兼容性差 | 消费产物的应用打包时编译 `node_modules`；或者运行环境支持的 ES2017 语法。更多说明可参考[文档](./abilities#es2017-产物) |
| `cjs` | 兼容各版本的 Node.js | 体积大 | 在 Node.js 环境下运行 |
| `umd` | 兼容运行在浏览器和 Node.js 中 | 体积大 | 用户的项目中某个依赖 external，需要在 HTML 中通过 `<script />` 引入 UMD 产物；或者在浏览器中直接使用产物 |

## 默认构建产物

下面是 ICE PKG 默认的产物构建配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['esm', 'es2017'],
  },
})
```

默认情况下，ICE PKG 只启用 Transform 模式并将产物分别输出到 `esm` 目录和 `es2017` 目录。

执行 `npm run build` 命令后，得到以下的构建产物：
```md
── es2017
|  ├── index.d.ts
|  └── index.js
├── esm
|  ├── index.d.ts
|  └── index.js
```

输出构建目录名和构建产物类型一一对应。

对于 React 组件来说，它们会在应用中消费，而应用通常是会被打包工具打包后才能在生产环境中使用。以 Webpack 举例，可以配置 `resolve.conditionNames = ['es2017', 'esm']`，这样会优先使用 es2017 产物，配合在 `browserslist` 中配置高版本的浏览器（比如中后台场景），打包出来的产物能直接运行在目标浏览器，体积也会更小。

## 构建现代产物

如果你确定你的运行环境支持 [ES2017 产物](./abilities#es2017-产物)，推荐使用以下的配置仅生成体积更小的构建产物：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['es2017'],
  },
  bundle: {
    formats: ['esm', 'es2017'],
  },
})
```
> [Transform 模式](./abilities#transform-模式)和 [Bundle 模式](./abilities#bundle-模式)均支持生成 ES2017 产物。你可以根据实际的需求，选择启动单个模式或者双模式。

构建产物如下：

```md
── es2017
|  ├── index.d.ts
|  └── index.js
├── dist
|  └── index.esm.es2017.production.js
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
  transform: {
    formats: ['cjs', 'es2017'],
  },
  bundle: {
    formats: ['cjs', 'esm', 'es2017'],
  },
})
```
> [Transform 模式](./abilities#transform-模式)和 [Bundle 模式](./abilities#bundle-模式) 均支持生成 ES2017 产物和 CommonJS 产物。你可以根据实际的需求，选择启动单个模式或者双模式。

执行 `npm run build` 后输出的产物如下：

```md
── cjs
|  ├── index.d.ts
|  └── index.js
├── es2017
|  ├── index.d.ts
|  └── index.js
├── dist
|  ├── index.cjs.es5.production.js
|  └── index.esm.es2017.production.js
```

其中，`cjs` 目录和 `es2017` 目录是 Transform 构建模式的产物；`dist` 目录是 Bundle 构建模式的产物。

| 产物类型 | 模块规范 | 语法规范 |
| :-------: | ---- | ---- |
|   es2017    | ES Module  | ES2017 |
| cjs | CommonJS | ES5 |

然后在 `package.json` 中配置 `exports` 产物导出：

```json
{
  "exports": {
    ".": {
      "import": "./es2017/index.js",
      "require": "./cjs/index.js",
      "default": "./cjs/index.js",
    }
  }
}
```

## UMD 产物

一般情况下，[前端类库](./scenarios#前端类库)的场景需要打包构建生成 UMD 产物。

ICE PKG 仅支持在 [Bundle 模式](./abilities#bundle-模式)下构建出 UMD 产物，配置方式如下：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd'],
    name: 'my-library',  // 配置 umd 模块导出的名字，通过 `window[name]` 访问
  }
})
```

执行 `npm run build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```

如果需要额外输出一份未压缩的 UMD 产物以方便调试构建，可以新增 [bundle.modes 配置项](../reference/config#modes)：

```diff title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd'],
    name: 'my-library',
+   modes: ['production', 'development'],
  }
})
```

执行 `npm run build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.development.css
├── index.umd.es5.development.js
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```
