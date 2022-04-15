# 工程能力

:::tip
@ice/pkg 所有配置请参阅 [完整配置项](/reference/config-list)。
:::

## define

使用 `define` 定义编译时的环境变量。举个例子，你想要在代码的很多地方注入版本号，可以用一个全局变量 `__VERSION__` 来替代。

```ts
import fs from 'fs';
import { defineConfig } from '@ice/pkg';

const version = fs.readFileSync('./package.json', 'utf-8');

export default defineConfig({
  define: {
    '__VERSION__': version,
  }
});
```

在代码编译时，所有 `__VERSION__` 都会转换为项目的版本号。`define` 目前支持 `boolean`、`string`、`null`、`undefined`、`object` 等类型的值。

:::info
对于使用 TypeScript 的用户，需要在 `env.d.ts` 或其他类型声明文件中，声明 `define` 所设置的属性，以便可以通过类型检查，并获得类型提示。比如：

```ts title=env.d.ts
declare const __VERSION__: string
```
:::

`@ice/pkg` 为你默认注入 `__DEV__` 全局变量，这个变量在输出一些仅在 development 环境的信息时非常有用。比如，输出在用户开发态才显示的警告信息。

```ts title=index.ts
if (__DEV__) {
  console.warn('请注意，这可能会产生错误！');
}
```

:::info
发生了什么？实际上，在 Package 编译时，`__DEV__` 会被替换为 `process.env.NODE_ENV`。
:::

## 生成类型文件

`@ice/pkg` 默认为 TypeScript 生成类型文件，无需主动开启。

## sourcemap

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: true,
});
```

这会为所有产物额外输出 `.js.map` 文件。如果你想要 `inline` sourcemap，可将选项配置为 `inline`。

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: true,
});
```

## CSS 支持


