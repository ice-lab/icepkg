# 配置

若希望对 ICE PKG 的能力进行配置，可在项目根目录中添加名为 `build.config.mts` 的配置文件：

```ts title=build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // ...
  minify: true,
});
```

:::tip
完整配置项请[参阅文档](/reference/config-list)。
:::

注：ICE PKG 支持的配置文件类型包括：

+ `build.config.mts`
+ `build.config.mjs`
+ `build.config.ts`
+ `build.config.js`
+ `build.json`
