# React 组件

## 初始化 React 组件项目

```bash
$ npm init @ice/pkg react-component
```

会在当前目录生成巴拉巴拉@TODO...

## 使用 React 组件

React 组件通常输出 JavaScript 脚本资源和 CSS 样式资源。根据使用方式， 将其区分为两种开发形态：

### 单模块引入

该形态的组件使用方式：

```ts
import MyComponent from 'my-component';
```

该形态优点主要在于能充分利用构建器 tree-shaking 的能力，而且使用上非常简便。

:::tip
该使用方式是 ICE PKG 推荐和默认的使用方式。
:::

ICE PKG 对于这种 React 开发形态提供默认支持，等同于配置：

```ts title=build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['esm', 'es2017'],
  },
});
```

上述配置下，会输出 `esm` 和 `es2017` 两个文件夹。

```shell
- esm
- es2017
```

其导出配置 (Package Exports) 如下：

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

### 分别引入 JS 和 CSS

该形态的组件使用方式除需要引入脚本文件外，还需要引入 CSS 样式文件。使用方式：

```ts
import MyComponent from 'my-component';
import 'my-component/dist/index.css';
```

这种形态的组件开发适用于下列场景：

+ 组件使用 [sass](https://github.com/sass/sass)、[less](https://github.com/less/less.js) 等 CSS 预处理器语言编写，但需要输出 `.css` 样式。
+ 组件样式提供配置能力，比如支持外部 CSS 变量 ([CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties))

在 ICE PKG 中，推荐如下配置：

```ts title=build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['esm', 'es2017'],
    externals: true,
  },
});
```

该配置会在 `dist` 目录下输出以下文件：

```shell
- index.production.js
- index.es2017.production.js
```

导出配置如下：

```json title=package.json
{
  "type": "module",
  "module": "./dist/index.production.js",
  "exports": {
    "es2017": "./dist/index.es2017.production.js",
    "import": "./dist/index.production.js"
  }
}
```
