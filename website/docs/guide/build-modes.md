# 构建模式

ICE PKG 原生提供 **Transform** 和 **Bundle** 两种构建模式，你可以根据实际的开发需求选择对应的构建模式。

## 模式对比

| 对比项       | Transform 模式        | Bundle 模式            |
| ------------ | --------------------- | ---------------------- |
| 构建方式     | 逐文件编译            | 以入口为起点，递归打包 |
| 产物结构     | 与源码目录一一对应    | 合并为少数几个文件     |
| Tree-Shaking | 友好，由使用方负责    | 依赖构建工具内部处理   |
| 外部依赖处理 | 不处理，保留 import   | 可选打包或 external    |
| 适用场景     | React 组件、Node 模块 | 前端类库、UMD 格式产物 |

## 如何选择

- 开发 **React 组件、Rax 组件、Node 模块**等，推荐使用 **Transform 模式**，产物调试性好，且对 Tree-Shaking 友好
- 开发**前端类库**，或需要输出 **UMD 格式**、在浏览器中直接引入的场景，推荐使用 **Bundle 模式**

## Transform 模式

Transform 模式即把源文件**逐个编译**到输出目录，不对依赖做任何处理。

### 工作原理

假设有以下的文件结构：

```md
src
├── components
│ ├── About.jsx
│ └── Button.tsx
├── index.ts
├── util.js
└── index.scss
```

经过 ICE PKG 构建后，得到以下的结果：

```md
esm
├── components
│ ├── About.js
│ ├── Button.d.ts
│ └── Button.js
├── index.d.ts
├── index.js
├── util.js
└── index.scss
```

可以看到，在 Transform 模式下，ICE PKG 对源文件的处理是：

- 对于 TypeScript 文件（`.ts`/`.tsx`），将会被编译成 JavaScript 文件，并输出对应的 `.d.ts` 类型文件
- 对于 JSX 文件（`.jsx`），将会被编译成 JavaScript 文件，但不会生成 `.d.ts`（因为没有类型信息）
- 对于 JavaScript 文件，将会进行语法编译
- 其他类型的文件（比如 `.css`、`.scss` 等等），不做任何编译操作，将会被直接拷贝到输出目录

### 输入目录

Transform 模式的**处理范围**由 `entry` 决定：每个 entry 文件所在目录及其子目录中的文件都会被处理，且各 entry 之间互不重叠。

**单个 entry**（默认）：`entry` 默认为 `./src/index`，因此 `./src` 目录下的所有文件都会被处理：

```
src/               ← 处理范围
├── components/
│   └── Button.tsx
├── utils/
│   └── format.ts
└── index.ts       ← entry
```

**多个 entry**：每个 entry 对应一个独立的处理范围，互不干扰。

```ts title="build.config.mts"
export default defineConfig({
  entry: ['./src/browser/index.ts', './src/node/index.ts'],
});
```

```
src/
├── browser/       ← 处理范围（来自第一个 entry）
│   ├── index.ts
│   └── polyfill.ts
└── node/          ← 处理范围（来自第二个 entry）
    ├── index.ts
    └── fs.ts
```

两个目录的文件相互独立，不会混入对方的产物中。

### 输出目录

输出分为两层：**顶层目录**和**目录内的文件路径**。

**顶层目录**由产物格式决定：

- 使用 `transform.formats` 时，默认以格式名作为目录名，如 `esm`、`es2017`、`cjs`
- 使用 `pkgs` 时，以 `outputDir` 为准；未配置 `outputDir` 时，以 `id` 为准；未配置 `id` 时，自动根据 `module` 和 `target` 推导：
  - 优先使用 `module` 名（如 `esm`、`cjs`），与 `transform.formats` 的目录结构保持一致
  - 若 `module` 名已被同一 `pkgs` 中其他 pkg 占用，则改用 `module-target`（如 `esm-es2017`）

**目录内的文件路径**由 `entryRoot` 控制：以 `entryRoot` 为根，将源文件的相对路径映射到输出目录中。`entryRoot` 默认为所有 entry 所在目录的**最近公共祖先目录**（自动推导）。

以下面的 entry 配置为例：

```ts title="build.config.mts"
export default defineConfig({
  entry: ['./src/a/index.ts', './src/b/index.ts'],
});
```

两个 entry 的最近公共祖先是 `./src`，`entryRoot` 默认为 `./src`，输出结构如下：

```
esm/
├── a/
│   └── index.js
└── b/
    └── index.js
```

**自定义 entryRoot**：可通过 `transform.entryRoot` 手动指定，从而控制文件在输出目录内的路径深度。例如 entry 为 `./src/a/b/c/index.ts` 时：

- `entryRoot: './src/a/b'` → 输出 `esm/c/index.js`
- `entryRoot: './src'` → 输出 `esm/a/b/c/index.js`

注意，`entryRoot` 必须是所有 entry 目录的公共祖先，否则会报错。使用 `pkgs` 时，可在单个 pkg 上配置 `entryRoot`，优先级高于全局 `transform.entryRoot`。

## Bundle 模式

Bundle 模式即以入口文件作为起点，**递归处理各种模块**，最终把相同类型的文件合并成一个构建产物。

### 工作原理

假设有以下的文件结构：

```
src
├── components
│   └── Button.tsx
├── index.tsx
└── index.scss
```

经过 ICE PKG 构建后，得到以下的构建结果，所有的输出都默认输出到 `dist/` 目录下，可以通过 `outputDir` 自定义输出位置：

```
dist
├── index.esm.es2017.production.js
└── index.esm.es2017.production.css
```

### 分包规则

Bundle 模式默认开启代码分割（`codeSplitting: true`），分包策略如下：

- **`node_modules` 中的依赖**：统一提取到 `vendor` chunk，避免重复打包
- **多入口共享模块**：被多个入口同时引用的模块也会提取到 `vendor` chunk
- **UMD 格式**：不支持代码分割，所有模块合并为单一文件输出，同时会内联全部的动态 import 语法。

例如，多入口场景下产物结构可能如下：

```
dist/
├── foo.esm.es2017.production.js   ← 入口 foo 的产物
├── bar.esm.es2017.production.js   ← 入口 bar 的产物
└── vendor.esm.es2017.production.js ← foo 和 bar 共享的模块
```

如需关闭代码分割，可配置 `codeSplitting: false`：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    codeSplitting: false,
  },
});
```

### 外部依赖（external）

默认情况下，Bundle 模式会将所有依赖打包进产物。如果你希望某些依赖由使用方提供（如 `react`），可以配置 `external`：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
});
```

:::caution
字符串形式的 external 只做**精确匹配**，不会自动匹配子路径。例如配置 `externals: ['react']` 只会 external `react`，不会 external `react/jsx-runtime`、`react/server` 等子路径导入，这些仍会被打包进产物。

如需同时 external 包及其所有子路径，可以使用正则表达式，此时将无法正确匹配到 UMD Name，通常用于 Node 模块的构建：

```ts
externals: ['react', /^react\//];
```

:::
