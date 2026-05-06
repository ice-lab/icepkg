# transform

:::tip
Transform 模式是 ICE PKG 默认的编译模式。推荐使用 [`pkgs`](./pkgs) 配置多产物输出。
:::

该字段定义 [Transform 模式](../guide/build-modes#transform-模式) 下额外的配置。

## formats

:::tip
推荐使用 [`pkgs`](./pkgs) 替代 `formats` 来配置多产物输出，`pkgs` 提供更灵活的差异化配置能力。
:::

- 类型：`Array<'cjs' | 'esm' | 'es2017' | 'es2022'>`
- 默认值：无

输出的格式类型。若想同时输出多种格式，可如下配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['cjs', 'esm', 'es2017'],
  },
});
```

则输出如下文件夹：

```shell
- cjs    # CommonJS + ES5 产物
- esm    # ES module + ES5 产物
- es2017 # ES module + ES2017 产物
```

## entryRoot

- 类型：`string`
- 默认值：自动推导（已配置 entry 父目录的最近公共祖先）

用于控制 Transform 模式输出路径的相对根目录。该配置只影响产物路径映射，不影响文件处理范围。

例如，当 entry 是 `./src/a/b/c/index.ts`：

- `entryRoot: './src/a/b'` 时，输出为 `esm/c/index.js`
- `entryRoot: './src'` 时，输出为 `esm/a/b/c/index.js`

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  entry: './src/a/b/c/index.ts',
  transform: {
    formats: ['esm'],
    entryRoot: './src/a/b',
  },
});
```

当使用 `pkgs` 配置时，`pkgs[].entryRoot` 的优先级高于 `transform.entryRoot`。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    entryRoot: './src',
  },
  pkgs: [
    {
      id: 'button',
      entry: './src/components/button/index.ts',
      entryRoot: './src/components',
    },
  ],
});
```

## excludes

- 类型：`string | string[]`
- 默认值：`['**/__tests__/**']`

排除无需编译的文件。默认会排除 `__tests__` 目录下文件。比如，我们还不想编译 `src` 下以 `*.test.[j|t]s` 结尾的测试文件。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    excludes: ['**/__tests__/**', '*.test.[j|t]s'],
  },
});
```

`excludes` 的配置完全遵循 [minimatch](https://github.com/isaacs/minimatch) 写法。
