# helpers

- 类型：`'external' | 'inline'`
- 默认值：`'external'`

配置 SWC 编译时辅助函数（helper functions）的处理方式。

- **`'external'`（默认）**：从 `@swc/helpers` 包中导入 helper 函数，产物体积更小，但需要消费方的运行环境中存在该依赖。
- **`'inline'`**：将 helper 函数内联到每个文件中，无需外部依赖，适合对外发布的独立类库。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  helpers: 'inline',
});
```

也可以在 [`pkgs`](./pkgs) 中为某个产物单独配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: [
    { module: 'esm', target: 'es2017' },
    {
      module: 'umd',
      bundle: true,
      helpers: 'inline', // 仅 UMD 产物内联 helpers
    },
  ],
});
```
