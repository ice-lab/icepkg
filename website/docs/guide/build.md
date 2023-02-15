# 构建产物

## 构建 ES Module 产物和 CommonJS 产物

下图是 ICE PKG 推荐在

| 产物类型/运行环境 | 浏览器 | Node.js |
| :-------: | ---- | ---- |
| ES Module | ✅ 推荐 | ✅ 推荐 |
| CommonJS  | ❌ 不推荐 | ✅ 推荐 |

- 对于要运行在浏览器的产物（比如 React 组件）来说，CommonJS 产物没必要生成，首先浏览器根本不支持 CommonJS 产物，其次 ES Module 是面向未来的标准产物
- 对于要运行在 Node.js 产物，如果需要兼容低版本 Node.js (v12.20.0 以下)，则还是需要生成 CommonJS 产物；有很多的场景是用于类前端工具库（比如命令行等等），用户使用的 Node.js 版本相对来说是比较高的，因此可以直接使用 ES Module 的产物

[Transform 模式](./abilities#transform-模式)和 [Bundle 模式](./abilities#bundle-模式) 均支持生成 ES Module 产物和 CommonJS 产物。你可以根据实际的需求，选择启动单个模式或者双模式。配置方式如下：

```ts title="ice.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['cjs', 'esm'],
  },
  bundle: {
    formats: ['cjs', 'esm'],
  },
})
```

执行 `ice-pkg build` 后输出的产物如下：

```md
── cjs
|  ├── index.d.ts
|  └── index.js
├── esm
|  ├── index.d.ts
|  └── index.js
```

然后在 `package.json` 中配置 `exports` 产物导出：

```json
{
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js",
      "default": "./cjs/index.js",
    }
  }
}
```

:::tip
关于更多 `package.exports` 导出规则，可以查看 [Node.js 文档](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points)。
:::

## 构建面向现代浏览器产物

ICE PKG

## 构建 UMD 产物

一般情况下，[前端类库](./scenarios#前端类库)的场景需要打包构建生成 UMD 产物。

ICE PKG 仅支持在 [Bundle 模式](./abilities#bundle-模式)下构建出 UMD 产物，配置方式如下：

```ts title="ice.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd'],
  }
})
```

执行 `ice-pkg build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.development.css
├── index.umd.es5.development.js
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```

如果需要额外输出一份未压缩的 UMD 产物以方便调试构建，可以新增 [bundle.modes 配置项](config#modes)：

```diff title="ice.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd'],
+   modes: ['production', 'development'],
  }
})
```

执行 `ice-pkg build` 后，将会输出以下的构建结果：

```md
dist
├── index.umd.es5.production.css
└── index.umd.es5.production.js
```

## SideEffects 副作用
