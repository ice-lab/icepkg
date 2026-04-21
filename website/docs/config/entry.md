# entry

- 类型：`string | string[] | { [entryAlias: string]: string }`
- 默认值：`'./src/index'`

指定构建入口。支持配置单入口或者多个入口。

指定单个入口：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  entry: './src/index',
});
```

指定多个入口：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  // 数组形式
  entry: ['./src/foo', './src/bar'],
  // 对象形式，key 值作为 chunk name
  entry: {
    foo: './src/foo',
    bar2: './src/bar',
  },
});
```
