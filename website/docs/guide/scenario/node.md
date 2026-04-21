# Node 模块

如果现在有相同的工具函数在多个 Node 应用被消费，可以把这些公共的函数抽成一个 npm 包，供多个 Node 应用使用。支持经过 Transform 模式生成 CommonJS 产物和 ES Module 产物。

```ts title="src/index.ts"
import fs from 'fs';

export function writeLicenseToFileHeader(absFilePath: string) {
  const newFileContent = '/* LICENSE */' + fs.readFileSync(absFilePath, 'utf-8');
  fs.writeFileSync(absFilePath, newFileContent);
}
```

推荐使用以下配置，同时生成 CJS 和 ESM 产物以兼容不同版本的 Node.js：

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  pkgs: ['cjs', 'es2017'],
});
```

然后在 `package.json` 中配置 `exports` 产物导出：

```json
{
  "exports": {
    ".": {
      "import": "./es2017/index.js",
      "require": "./cjs/index.js",
      "default": "./cjs/index.js"
    }
  }
}
```

:::tip
不同版本的 Node.js 支持的 ECMAScript 语法可参考 [Node Green 网站](https://node.green/)。Node 12.20.0 及以上已支持 ES Module 和 ES2017 全部语法。
:::
