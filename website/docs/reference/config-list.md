# 完整配置项

所有配置项如下：

## alias

+ 类型 `object`
+ 默认值 `{}`

比如，将 `@` 指向 `./src/` 目录。

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  alias: {
    '@': './src/'
  }
})
```

## define

+ 类型 `string|boolean|object|null|undefined`
+ 默认值 `{}`

定义编译时环境变量，会在编译时被替换。详细介绍 [工程能力 - define](/guide/abilities#define)。

## sourceMaps

+ 类型 `boolean | 'inline'`
+ 默认 `false`

是否生成 sourcemap，这在代码调试的时候非常有用。详细介绍 [工程能力 - 生成类型文件](/guide/abilities#sourcemap)。

## generateTypesForJs

+ 类型 `boolean`
+ 默认 `false`

为 JavaScript 代码生成类型文件。@ice/pkg 默认为文件后缀为 `.ts` 生成类型文件。

如果使用 [JSDoc](https://jsdoc.app/) 为 JavaScript 生成了类型注解，该配置会非常有效。详细介绍 [工程能力 - 生成类型文件](/guide/abilities#生成类型文件)。

## plugins

+ 类型 `array`
+ 默认 `[]`

@ice/pkg 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统。更多内容请参考 [插件开发](#插件开发)。

## transfrom

该字段定义 [transform 模式](/#双模式) 下额外的配置。`bundle` 包含以下配置：

:::tip
transform 模式是 @ice/pkg 默认的编译模式。
:::

### formats

+ 类型 `['esm', 'cjs', 'es2017']`
+ 默认 `['esm', 'es2017']`

输出的类型。@ice/pkg 会默认编译出 `esm` (输出 ES module + es5 产物) 和 `es2017` (输出 ES module + es2017 产物) 两个文件夹。

```shell
- esm # ES module + es5 产物
- es2017 # ES module + es2017 产物
```

若想要输出 CommonJS 产物，可如下配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transfrom: {
    formats: ['cjs', 'esm', 'es2017'],
  }
})
```

则输出如下文件夹：

```shell
- cjs # CommonJS + es5 产物
- esm # ES module + es5 产物
- es2017 # ES module + es2017 产物
```

### excludes

+ 类型 `string | string[]`
+ 默认 `空`

排除无需编译的文件。比如，我们不想编译 `src` 下的所有测试文件，其中测试文件包含在 `__tests__` 目录下，或以 `*.test.[j|t]s` 结尾。

```js
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transfrom: {
    excludes: ['**/__tests__/**', '*.test.[j|t]s'],
  }
})
```

`excludes` 的配置完全遵循 [minimatch](https://github.com/isaacs/minimatch) 写法。

## bundle

该字段定义 [bundle 模式](/#双模式) 下额外的配置，若开启，默认生成 `dist` 文件目录。`bundle` 包含以下配置：

### formats

+ 类型 `['esm', 'umd', 'es2017']`
+ 默认 `['esm', 'es2017']`

输出的类型，默认是输出 `esm` 和 `es2017` 产物。

```shell title=root/dist
- index.production.js # 输出 ES module + es5 产物
- index.es2017.production.js # 输出 ES module + es2017 产物
```

若只需要产出 umd 规范产物，可配置为：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    formats: ['umd', 'es2017'],
  }
})
```

则输出一下产物：

```shell title=root/dist
- index.umd.production.js # 输出 umd + es5 产物
- index.umd.es2017.production.js # 输出 umd + es2017 产物
```

### name

+ 类型 `string`
+ 默认 `package.name`

library 导出的名称，可以通过 `window[name]` 访问。默认为 `package.json` 配置的 `name` 字段。

### filename

+ 类型 `string`
+ 默认 `index.js`

生成的文件名前缀，默认为 `index.js`。

### externals

+ 类型 `boolean|object`
+ 默认 `true`

默认情况下，bundle 的产物不包含依赖产物。该选项可修改这一结果。若想要 bundle 包含所有依赖产物，可如下配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: false,
  }
})
```

若想要自定义配置 externals，参考如下配置：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }
})
```

### development

+ 类型 `boolean`
+ 默认 `false`

若开启该选项，则会额外输出一份 **未压缩的** 的产物，这也意味着用户可以在开发态使用该产物获得更多的开发时信息。在开发 Library 时，这将会非常有作用。

```js
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  bundle: {
    development: true,
  }
})
```

上述配置会输出如下产物：

```shell title=root/dist
- index.development.js # 输出未压缩产物（ES module + es5）
- index.production.js # 输出压缩产物 (ES module + es5)
- index.es2017.development.js # 输出未压缩产物 （ES module + es2017）
- index.es2017.produciton.js # 输出未压缩产物 (ES module + es2017)
```
