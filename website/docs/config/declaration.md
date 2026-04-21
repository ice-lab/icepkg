# declaration

- 类型：`boolean | { outputMode?: 'multi' | 'unique'; generator?: 'tsc' | 'oxc' }`
- 默认值：`true`

配置 `.d.ts` 类型文件的生成行为。默认会为 TypeScript 文件自动生成类型文件。

## outputMode

- 类型：`'multi' | 'unique'`
- 默认值：`'multi'`

控制类型文件的输出位置：

- `'multi'`：将 `.d.ts` 文件输出到每个 Transform 产物目录下（如 `esm/`、`es2017/`）
- `'unique'`：将所有 `.d.ts` 文件统一输出到根目录的 `typings/` 文件夹

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    outputMode: 'unique',
  },
});
```

## generator

- 类型：`'tsc' | 'oxc'`
- 默认值：`'tsc'`

选择生成类型文件的工具：

- `'tsc'`：使用 TypeScript 官方编译器生成类型文件
- `'oxc'`：使用 [oxc-transform](https://oxc.rs/) 生成 isolated declaration，速度更快，但要求源码符合 [isolated declarations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html) 规范

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    generator: 'oxc',
  },
});
```

## allowJs

- 类型：`boolean`
- 默认值：`false`

是否为 JavaScript 文件生成类型文件。当项目使用 [JSDoc](https://jsdoc.app/) 为 JavaScript 添加了类型注解时，开启此选项可以生成对应的 `.d.ts` 文件。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: {
    allowJs: true,
  },
});
```

## 禁用类型生成

若不需要生成类型文件，可将其设置为 `false`：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: false,
});
```
