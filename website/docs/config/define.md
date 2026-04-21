# define

- 类型：`Record<string, string | boolean | number | object | null>`
- 默认值：`{ __DEV__: 'true' | 'false', 'process.env.NODE_ENV': '"development"' | '"production"', 'import.meta.vitest': 'undefined' }`

定义编译时环境变量，会在编译时被替换。注意：属性值会经过一次 `JSON.stringify()` 转换。

例如，希望在代码中注入版本号，用全局变量 `__VERSION__` 来替代：

```ts title="build.config.mts"
import pkg from './package.json' assert { type: 'json' };
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  define: {
    __VERSION__: pkg.version,
  },
});
```

在编译时，所有 `__VERSION__` 都会被替换为项目的版本号。

:::tip

在 TS 项目中，需要在 `typings.d.ts` 或其他类型声明文件中，声明 `define` 所设置的属性，以便通过类型检查，并获得类型提示。比如：

```ts title=typings.d.ts
declare const __VERSION__: string;
```

:::

ICE PKG 默认注入了 `__DEV__` 全局变量，用于标识开发态环境。这个变量在输出一些仅在 development 环境的信息时非常有用。比如，输出在用户开发态才显示的警告信息。

```ts title=index.ts
if (__DEV__) {
  console.warn('请注意，这可能会产生错误！');
}
```

:::info 发生了什么？
实际上，在编译时，`__DEV__` 会被替换为 `process.env.NODE_ENV !== 'production'`。
:::

另外，ICE PKG 默认会将 `import.meta.vitest` 替换为 `undefined`。这意味着在源码里使用 Vitest 的 [in-source test](https://vitest.dev/guide/in-source.html) 写法时，非测试构建默认不会把对应测试逻辑保留到产物中。
