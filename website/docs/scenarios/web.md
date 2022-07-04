# 前端类库

前端类库指的是运行在浏览器环境中的 JavaScript 模块，使用的场景有：

+ 类似 React、lodash、moment 等需要对外提供 UMD 产物
+ 同时提供未压缩的版本，满足开发态需求
+ 同时需要提供 NPM 包消费的产物

ICE PKG 的 [transform 模式](/#双模式) 和 [bundle 模式](/#双模式) 统统满足你的要求。现在，通过以下进行配置：

```ts title=build.config.ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd', 'es2017'],
    externals: false,
  },
  transform: {
    formats: ['esm', 'es2017'],
  },
});
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

导出配置示例如下：

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
