# 构建模式

ICE PKG 原生提供 Transform 和 Bundle 两种构建模式，你可以根据实际的开发需求使用对应的构建模式。

## Transform 模式

Transform 模式即把源文件逐个编译到输出目录，不对依赖做任何处理。

假设有以下的文件结构：

```md
src
├── components
   ├── About.jsx
|  └── Button.tsx
├── index.ts
├── util.js
└── index.scss
```

经过 ICE PKG 构建后，得到以下的结果：

```md
esm
├── components
|  ├── About.js
|  ├── Button.d.ts
|  └── Button.js
├── index.d.ts
├── index.ts
├── util.js
├── index.scss
```

可以看到，在 Transform 模式下，ICE PKG 对源文件的处理是：

- 对于 TypeScript 文件，将会被编译成 JavaScript 文件，并输出对应的 `d.ts` 类型文件
- 对于 TSX 和 JSX 文件来说，将会被编译成 JavaScript 文件
- 对于 JavaScript 文件，将会进行语法编译
- 其他类型的文件（比如 `.css`、`.scss` 等等），不做任何编译操作，将会被直接拷贝到输出目录

Transform 模式下输出的产物具有较好的调试性，并且对 Tree-Shaking 友好。适用于大部分开发 React 组件或者 Node 模块场景。

## Bundle 模式

Bundle 模式即以入口文件作为起点，递归处理各种模块，最终把相同类型的文件合并成一个构建产物。目前 Webpack、Rollup 等就是对源码进行打包构建的工具。

假设有以下的文件结构：

```
src
├── components
|  └── Button.tsx
├── index.tsx
└── index.scss
```

经过 ICE PKG 构建后，得到以下的构建结果：

```
dist
├── index.esm.es2017.production.js
└── index.esm.es2017.production.css
```

Bundle 模式下输出的产物不需要额外依赖其他模块（不开启 `externals`），一般适用于前端类库要打包成 UMD 格式产物或在浏览器中直接导入构建产物等场景。
