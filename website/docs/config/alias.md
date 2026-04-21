# alias

- 类型：`Record<string, string>`
- 默认值：`{}`

配置路径别名。

比如，将 `@` 指向 `./src` 目录：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  alias: {
    '@': './src',
  },
});
```

然后代码里 `import '@/foo'` 会被改成 `import '/path/to/your/project/foo'`。
