# sourceMaps

- 类型：`boolean | 'inline'`
- 默认值：start 阶段默认为 `true`，build 阶段默认为 `false`

是否生成 sourcemap，这在代码调试的时候非常有用。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: true,
});
```

这会为所有产物额外输出 `.js.map` 文件。如果你想要 sourcemap 是内联在源码中的，可将选项配置为 `inline`：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',
});
```
