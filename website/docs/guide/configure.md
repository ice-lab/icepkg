# 配置

## 配置文件

ICE PKG 会自动从项目根目录读取配置文件，支持以下格式（按优先级排序）：

- `build.config.mts`
- `build.config.mjs`
- `build.config.ts`
- `build.config.js`

推荐使用 `build.config.mts`，配合 `defineConfig` 工具函数可以获得完整的类型提示和自动补全：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // 配置项
});
```

## 自定义配置文件路径

如果需要使用非默认路径的配置文件，可以通过 `--config` 参数指定：

```bash
npx icepkg build --config ./config/build.config.mts
```

## 导出函数

配置文件也支持导出一个函数：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig(() => ({
  pkgs: ['esm', 'es2017'],
}));
```

## 环境变量

可以结合环境变量动态调整配置：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    minify: process.env.NODE_ENV === 'production',
  },
});
```

## 完整配置项

所有可用配置项请参考[配置文档](../config/)。
