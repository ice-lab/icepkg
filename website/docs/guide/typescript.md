# TypeScript

ICE PKG 原生支持引入和使用 `.ts`/`.tsx` 文件。使用 [SWC](https://swc.rs/docs/configuration/swcrc) 进行编译，相比 `tsc` 有着数十倍的编译速度提升，同时热更新的时间也有明显的减少。

## 类型声明

默认情况下，我们使用的一些模块（比如 `.module.css`、`.jpg` 等）或者全局变量（比如 `NODE_ENV` 等）类型是未定义的，在编辑器中是有报错提示。为此 ICE PKG 默认提供一份类型声明，你可以在项目中新增一个 `d.ts` 类型声明文件并加入以下的内容：

```ts title="src/typings.d.ts"
/// <reference types="@ice/pkg/types" />
```

## 声明文件

ICE PKG 默认会为 Transform 模式下的 TypeScript 文件自动生成 `.d.ts` 类型声明文件，并将其输出到每个 Transform 产物目录下（如 `esm/`、`es2017/`）：

```
esm/
├── index.d.ts
└── index.js
es2017/
├── index.d.ts
└── index.js
```

### 选择生成器

通过 `declaration.generator` 可以选择生成类型文件所使用的工具：

**tsc（默认）**：使用 TypeScript 官方编译器，兼容性最好，支持所有 TypeScript 语法。

**oxc（实验性）**：使用 [oxc-transform](https://oxc.rs/) 生成 isolated declaration，速度比 tsc 快很多。但有以下限制：

- 源码必须符合 [isolated declarations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html) 规范，即每个导出的类型必须可以独立推断，不依赖跨文件的类型推导
- 需要在 `tsconfig.json` 中开启 `isolatedDeclarations: true`

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    generator: 'oxc',
  },
});
```

### 控制输出位置

通过 `declaration.outputMode` 可以控制类型文件的输出位置：

- **`multi`（默认）**：将 `.d.ts` 文件输出到每个 Transform 产物目录下
- **`unique`**：将所有 `.d.ts` 文件统一输出到根目录的 `typings/` 文件夹，适合只需要一份类型文件的场景

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    outputMode: 'unique',
  },
});
```

使用 `unique` 模式时，需要在 `package.json` 中通过 `types` 字段指向类型文件：

```json
{
  "types": "./typings/index.d.ts"
}
```

### 为 JS 文件生成类型

对于使用 [JSDoc](https://jsdoc.app/) 为 JavaScript 添加了类型注解的项目，可以通过 `declaration.allowJs` 开启对 JS 文件的类型生成：

```js
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
  return a + b;
}
```

为 JavaScript 文件开启 [`declaration.allowJs`](../config/declaration#allowjs) 配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    allowJs: true,
  },
});
```

则会生成一个 `add.d.ts` 文件，内容如下：

```ts
export function add(a: number, b: number): number;
```

:::warning 谨慎使用该配置
若贸然为没有使用 JSDoc 注解的 JavaScript 代码开启该配置，可能会出现自动类型推断错误的情况。
:::

### 禁用类型生成

若不需要生成类型文件，可将 `declaration` 设置为 `false`：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: false,
});
```

完整配置说明请参考 [declaration 配置项](../config/declaration)。
