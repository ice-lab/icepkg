# Node 模块

对于消费在 Node 端的产物，根据是否还需要提供 CommonJS 产物，可分为两种开发形态。

## Pure ESM

[Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) 是只提供 ES module 产物的开发形态，要求 Node 的版本在 `^12.20.0 || ^14.13.1 || >=16.0.0` 的范围。

:::tip
@ice/pkg 更推崇 Pure ESM 的开发模式。
:::

Pure ESM 的开发形态下只需输出 `es2017` 的产物即可。配置如下：

```ts title=build.config.ts
import { defineConfig } from '@ice/pkg';

export default defineConfig(
  transform: {
    formats: ['es2017'],
  }
})
```

同时 Packge Exports 的配置如下：

```json title=package.json
{
  "type": "module",
  "exports": "./es2017/index.js"
}
```

## Dual Mode

[Dual Mode](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#dual-commonjses-module-packages) 旨在同时提供 CommonJS 和 ES module 产物。通常是为了兼容 Node 版本低于 `12.20.0` 的版本。

:::warning
Node 10.x、Node 11.x 已在 [2021年4月](https://github.com/nodejs/Release#end-of-life-releases) 停止维护。请使用 Pure ESM 开发你的 Node 模块。
:::

支持 Dual Mode 的模块需要额外输出 CommonJS 产物，配置如下：

```ts title=build.config.ts
import { defineConfig } from '@ice/pkg';

export default defineConfig(
  transform: {
    formats: ['cjs', 'es2017'],
  }
})
```

该配置输出 `cjs` 和 `es2017` 两个文件夹：

```shell
- cjs
- es2017
```

推荐的 Package Exports 配置如下，且不推荐配置 `type: "module"`

```diff title=package.json
{
- "type": "module",
  "exports": {
    "import": "./es2017/index.js",
    "require": "./cjs/index.js"
  }
}
```
