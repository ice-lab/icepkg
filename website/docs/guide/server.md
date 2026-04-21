# 开发服务器

ICE PKG 内置了一个轻量的开发服务器，可在 `start` 模式下直接预览 Bundle 产物，无需额外搭建服务。

通过 [`server`](../config/server) 配置项启用：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: true,
});
```

启动后访问 `http://localhost:5138` 即可预览产物。支持端口、host、HTTPS、代理、CORS 等配置，详见 [server 配置项](../config/server)。
