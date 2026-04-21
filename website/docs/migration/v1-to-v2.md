# V1 迁移到 V2

本文档帮助你从 ICE PKG V1 迁移到 V2 版本，列出所有不兼容的变更及对应的迁移方式。

## 升级依赖

```bash
pnpm add @ice/pkg@latest
```

---

## Breaking Changes

### 移除 `development` 配置项

`bundle.development` 已移除，请改用 `bundle.modes`：

```diff
export default defineConfig({
  bundle: {
-   development: true,
+   modes: ['development', 'production'],
  },
});
```

---

### `polyfill` 默认值从 `'usage'` 改为 `false`

V1 中 `polyfill` 默认值为 `'usage'`，会自动注入 `core-js` polyfill。V2 中默认值改为 `false`，不再自动注入。

如果你的产物需要 polyfill，请显式配置：

```ts
export default defineConfig({
  bundle: {
    polyfill: 'usage', // 或 'entry'
  },
});
```

---

### `externals` 字符串不再匹配子路径

V1 中配置字符串 `externals` 会模糊匹配子路径（如 `'lodash'` 会同时 external 掉 `lodash/get`）。V2 改为精确匹配，字符串只匹配完整包名。

如需 external 子路径，请改用正则或数组形式：

```ts
export default defineConfig({
  bundle: {
    // V1: externals: { lodash: 'lodash' }  // 会匹配 lodash 及所有子路径
    // V2: 只匹配 'lodash'，不匹配 'lodash/get'
    externals: [/^lodash/], // 使用正则匹配所有 lodash 子路径
  },
});
```

---

### 移除 `defineJestConfig` / `defineVitestConfig`

V1 中 `@ice/pkg` 导出了 `defineJestConfig` 和 `defineVitestConfig` 帮助函数，用于将构建配置中的 `alias`、`define` 等同步到测试框架。V2 已移除这两个方法。

请直接在测试框架配置中手动配置 alias 等选项：

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@': './src',
    },
  },
});
```

同时，V2 支持 [Vitest In-Source Testing](https://vitest.dev/guide/in-source)，`import.meta.vitest` 会在构建产物中被自动替换为 `undefined`，无需额外配置。

---

### UMD 产物默认启用 `inlineDynamicImports`

V2 中 UMD 构建模式下默认启用 `inlineDynamicImports`，所有动态导入会被内联到单个产物文件中。这是为了避免 UMD 产物因分包导致运行时无法加载依赖 chunk 的问题。

如果你之前依赖 UMD 产物的分包行为，需要注意产物结构会发生变化。

---

### ES5 构建模式下默认编译所有依赖

V2 中 Bundle 模式使用 `es5` 语法目标时，会默认对 `node_modules` 中的依赖代码一并编译降级，确保产物语法兼容性。V1 中依赖代码默认不会被编译。

如果你的依赖已经是 ES5，这不会有影响；若依赖包含高版本语法，V2 会自动处理，无需额外配置。

---

### `generateTypesForJs` 迁移到 `declaration.allowJs`

顶级配置项 `generateTypesForJs` 已移除，改为 `declaration.allowJs`：

```diff
export default defineConfig({
- generateTypesForJs: true,
+ declaration: {
+   allowJs: true,
+ },
});
```

---

## AI 迁移 Prompt

如果你使用支持 Agent 模式的 AI 工具（如 Claude Code、Cursor、Copilot Workspace 等），可以使用以下模板让 AI 自动完成迁移：

```
你是一个专业的前端工程师，请帮我将当前项目的 ICE PKG 构建配置从 V1 迁移到 V2。

## 任务

1. 读取项目根目录下的 `build.config.mts`（或 `build.config.ts` / `build.config.mjs`）
2. 检查并修复以下所有 Breaking Changes
3. 如有涉及测试框架配置（`jest.config.*` / `vitest.config.*`），一并读取并修复
4. 直接修改文件，完成后输出变更摘要

## Breaking Changes 检查清单

- [ ] `bundle.development: true` → 替换为 `bundle.modes: ['development', 'production']`
- [ ] `bundle.polyfill` 未配置但原本依赖默认注入 → 根据需要显式设为 `'usage'` 或 `'entry'`
- [ ] `externals` 使用字符串且需要匹配子路径 → 改用正则，例如 `'lodash'` → `/^lodash/`
- [ ] 从 `@ice/pkg` 导入了 `defineJestConfig` 或 `defineVitestConfig` → 移除，手动配置测试框架的 alias 等选项
- [ ] `generateTypesForJs: true` → `declaration: { allowJs: true }`

## 注意事项

- 只修改需要变更的部分，保持其他配置不变
- 如果某项 Breaking Change 在当前项目中不涉及，跳过即可
- 修改前先读取文件，确认当前内容后再做变更
```
