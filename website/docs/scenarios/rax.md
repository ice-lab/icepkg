# Rax 组件

## 初始化 Rax 组件项目

```bash
$ npm init @ice/pkg rax-component
```

项目类型选择『Rax 组件』，会在当前目录下新建 rax-component 文件夹并在其中初始化 Rax 组件项目，其文件目录结构如下：

```shell
.
├── README.md
├── build.config.mts
├── docs
│   ├── index.md 
│   ├── usage.js
│   ├── usage.md
│   └── usage.module.css
├── package.json
├── src                      
│   ├── index.module.css    
│   ├── index.tsx
│   └── typings.d.ts
└── tsconfig.json
```


## 使用 Rax 组件

### 单模块引入

同 React 组件相同，该形态的组件使用方式：

```ts
import { createElement } from 'rax';
import MyComponent from 'my-component';

export default function App() {
  return (
    <div>
      <MyComponent />  
    </div>
  );
}
```

ICE PKG 对于这种 Rax 开发形态提供默认支持，等同于配置：

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

同 React 组件相同,该形态的 Rax 组件使用方式除需要引入脚本文件外，还需要引入 CSS 样式文件。使用方式：

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
    externals: {
      rax: 'Rax',
    },
  },
});
```

:::tip
对于 Rax 组件的 bundle 产物而言，externals 配置 `rax` 是 ICE PKG 推荐的方式。
:::

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

:::tip
Rax 组件在开发预览时实际底层运行时为 React，而在执行 `npm run build` 后生成的构建产物仍为 Rax 组件，仍可应用于 Rax 应用项目中。
:::
