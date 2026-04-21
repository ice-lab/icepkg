# 前端类库

前端类库指的是运行在浏览器环境中的 JavaScript 模块，并且所有的依赖都会打包到这个模块里面。

## 适用场景

**场景一：通过 `<script />` 引入 UMD 产物**

类似 [React](https://unpkg.com/browse/react@18.2.0/umd/)、[moment](https://unpkg.com/browse/moment@2.29.4/min/) 等类库，用户的项目中把这些依赖 external 掉，需要在 HTML 中通过 `<script />` 引入 UMD 产物：

```html
<html>
  <head>
    <script src="https://unpkg.com/your-lib-name/dist/index.umd.es5.production.js"></script>
  </head>
  <body>
    <script>
      console.log(window.YourLibName);
    </script>
  </body>
</html>
```

**场景二：通过 ES Module 方式加载**

在 `<script />` 标签内通过 `ES Module` 方式加载类库：

```html
<html>
  <body>
    <script type="module">
      import lib from './index.esm.es2017.production.js';
    </script>
  </body>
</html>
```

## 构建配置

前端类库通常使用 [Bundle 模式](../build-modes#bundle-模式) 构建，以将所有依赖打包到产物中：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    {
      bundle: true,
      module: 'umd',
      name: 'YourLibName', // 配置 umd 模块导出的名字，通过 `window[name]` 访问
    },
  ],
});
```

更多 UMD 产物配置请参考 [构建产物 — UMD 产物](../build#umd-产物)。
