# Web Library 开发

Library 的开发场景主要有：

+ 类似 React、lodash、moment 等需要对外提供 UMD 产物
+ 同时提供未压缩的版本，满足开发态需求
+ 同时需要提供 NPM package 消费的产物

`@ice/pkg` 的 transform 模式和 bundle 模式统统满足你的要求。现在，通过一下进行配置：

```ts title=build.config.ts
import { defineConfig } from '@ice/pkg';

export default defineConfig(
  bundle: {
    formats: ['umd', 'es2017'],
    externals: false,
  }
  transform: {
    formats: ['esm', 'es2017'],
  }
})
```

此配置下输出以下产物：

```shell
- dist
  - index.umd.production.js
  - index.umd.development.js
  - index.umd.es2017.production.js
  - index.umd.es2017.development.js
- esm
- es2017
```

Packge Exports 推荐配置如下：

```json title=package.json
{
  "type": "module",
  "module": "./esm/index.js",
  "exports": {
    "es2017": "./es2017/index.js",
    "import": "./esm/index.js"
  }
}
```
