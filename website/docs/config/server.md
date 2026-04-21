# server

- 类型：`boolean | ServerUserConfig`
- 默认值：`false`

配置内置预览服务器。设为 `true` 时使用默认配置启动服务器；设为对象时可进行详细配置。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: true,
});
```

## port

- 类型：`number`
- 默认值：`5138`

指定服务器监听的端口号。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: {
    port: 3000,
  },
});
```

## host

- 类型：`string`
- 默认值：`'0.0.0.0'`

指定服务器监听的 host。

## https

- 类型：`HttpsServerOptions | SecureServerSessionOptions`
- 默认值：`undefined`

启用 HTTPS 服务器。配置后 HTTP 服务器将被禁用。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';
import fs from 'node:fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem'),
    },
  },
});
```

## headers

- 类型：`Record<string, string | string[]>`
- 默认值：`undefined`

为所有响应添加自定义 HTTP 响应头。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
```

## cors

- 类型：`boolean | CorsOptions`
- 默认值：`undefined`

配置跨域（CORS）策略：

- `true`：使用默认选项启用 CORS（允许所有来源，不推荐用于生产环境）
- `false`：禁用 CORS
- 对象：使用 [cors](https://github.com/expressjs/cors) 的详细选项

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: {
    cors: {
      origin: 'https://your-site.com',
    },
  },
});
```

## proxy

- 类型：`Record<string, string | HttpProxyMiddlewareOptions> | HttpProxyMiddlewareOptions[]`
- 默认值：`undefined`

配置请求代理规则，将指定路径的请求转发到其他服务。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
```

## publicDir

- 类型：`string | { name?: string } | Array<string | { name?: string }>`
- 默认值：`{ name: 'public' }`

配置静态文件目录，目录下的文件会在服务器启动后直接提供访问。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  server: {
    publicDir: 'static',
  },
});
```

## autoServeBundle

- 类型：`boolean`
- 默认值：`true`

是否自动将构建产物（Bundle）通过服务器提供访问。
