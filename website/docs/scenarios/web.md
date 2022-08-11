# 前端类库

前端类库指的是运行在浏览器环境中的 JavaScript 模块，使用的场景有：

+ 类似 React、lodash、moment 等需要对外提供 UMD 产物
+ 同时提供未压缩的版本，满足开发态需求
+ 同时需要提供 NPM 包消费的产物

## 初始化前端类库项目

```bash
$ npm init @ice/pkg web-project
```

项目类型选择『前端类库』，会在当前目录下新建 web-project 文件夹并在其中初始化前端类库项目，其文件目录结构如下：

```shell
.
├── README.md
├── abc.json
├── build.config.mts
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

推荐使用 ICE PKG 的 [transform 模式](/#双模式) 和 [bundle 模式](/#双模式) 进行开发。使用以下配置：

```ts title=build.config.mts
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

:::tip
对于前端类库的 bundle 产物而言，externals 配置为 `false`（即打入所有依赖，也是 ICE PKG 的默认表现） 是 ICE PKG 推荐的方式。
:::

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
