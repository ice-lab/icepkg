# 插件开发

@ice/pkg 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统。通过 build-scripts 插件，可以极大地扩展 @ice/pkg 的能力。

插件的使用如下：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    "./customPlugin.ts"
  ]
})
```

## 修改默认配置

可以通过 `onGetConfig` API，可以修改 Package 编译的入口、出口等 @ice/pkg 等默认配置：

```ts
const plugin = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  onGetConfig('component-es', config => {
    return (
      ...config,
      outputDir: path.join(rootDir, 'esm'), // 将出口修改为 esm 文件夹
    )
  })
}
```

@ice/pkg 注册五个 build-script 任务：

+ `component-esm` - 默认启动
+ `component-es2017` - 默认启动
+ `component-cjs` - 当 transform 配置了 `formats: ['cjs']` 启动
+ `component-dist-esm` - 当bundle 配置了 `formats: ['esm']` 时启动
+ `component-dist-es2017` - 当开启 bundle 配置了 `formats: ['es2017']` 时启动

当不指定任务名（比如，指定 `component-esm`）时，配置对所有任务生效。

```ts
import svelte from 'rollup-plugin-svelte';

const plugin = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  // 不指定 Task name
  onGetConfig(config => {
    return {
      ...config,
      rollupPlugins: [
        svelte(...) // 编译 svelte 文件则会进行对应的
      ]
    }
  })
}
```

有以下参数可以配置：

### entry

+ 类型 `string`
+ 默认值 `./src | ./src/index.[j|t]s`

配置组件编译的入口。

| 任务            | 默认值                |
| -------------- | -------------------  |
| component-esm  | `./src`              |
| component-es2017   | `./src`              |
| component-cjs  | `./src`              |
| component-dist-esm  | `./src/index[j|t]s`  |
| component-dist-es2017  | `./src/index[j|t]s`  |

### outputDir

+ 类型 `string`
+ 默认值 `es | lib | dist`

配置组件编译的出口。

| 任务            | 默认值              |
| -------------- | -------------------|
| component-esm   | `esm`               |
| component-es2017   | `es2017`               |
| component-cjs  | `cjs`              |
| component-dist-esm  | `dist`             |
| component-dis-es2017  | `dist`  |

### rollupPlugins

+ 类型 `array`
+ 默认值 `[]`

配置额外的 [rollupPlugins](https://rollupjs.org/guide/en/#plugin-development)。

### rollupOptions

+ 类型：`object`
+ 默认值 `{}`

当 [开启 bundle 模式](/reference/config-list#bundle)，可通过 `rollupOptions` 配置额外的 [rollup 配置](https://rollupjs.org/guide/en/#command-line-flags)。

当试图修改 `rollupOptions.plugins` 参数时，建议直接使用 [rollupPlugins](#rollupPlugins) 参数。

### swcCompileOptions

+ 类型 `array`
+ 默认值 `{}`

swc 编译选项。具体可参考 [swc 配置](https://swc.rs/docs/configuration/swcrc)。

## 插件生命周期钩子

@ice/pkg 插件提供一下生命周期钩子：

+ build 命令：

| 生命周期            | 参数                                                  | 调用时机              |
| ------------------- | ----------------------------------------------------- | --------------------- |
| before.build.load   | { args: CommandArgs; config: PkgConfig[] } | 获取所有任务配置后|
| before.build.run    | { args: CommandArgs; config: PkgConfig[]  } | 编译执行之前  |
| after.build.compile | - | 编译结束              |

+ start 命令

| 生命周期            | 参数                                                  | 调用时机              |
| ------------------- | ----------------------------------------------------- | --------------------- |
| before.start.load   | { args: CommandArgs; config: PkgConfig[] } | 获取所有任务配置后|
| before.start.run    | { args: CommandArgs; config: PkgConfig[]  } | 编译执行之前  |
| after.start.compile | - | 编译结束              |
