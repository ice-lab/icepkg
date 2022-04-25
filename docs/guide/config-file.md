# 配置文件

若想要修改或支持额外的能力，可在项目中添加以下任意配置文件：

+ `build.json`
+ `build.config.js`
+ `build.config.ts`
+ `build.config.mjs`
+ `build.config.mts`

建议以项目配置 `build.config.ts` 文件，并引入 `defineConfig` 以获得更好的类型提示：

```ts title=build.config.ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // 你的配置
  minify: true,
})
```
