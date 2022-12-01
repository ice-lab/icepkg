# 开发插件

ICE PKG 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统。通过 build-scripts 插件，可以极大地扩展 ICE PKG 的能力。

插件的示例如下：

```ts title="customPlugin.ts"
import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  console.log('api: ', api);
}

export default plugin;
```

然后在 `build.config.mts` 中引入插件：

```ts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    './customPlugin.ts',
  ],
});
```

## context


## onGetConfig

可以通过 `onGetConfig` API，可以修改 Package 编译的入口、出口等 ICE PKG 等默认配置：

```ts
const plugin = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  onGetConfig('component-es', config => {
    return ({
      ...config,
      outputDir: path.join(rootDir, 'esm'), // 将出口修改为 esm 文件夹
    });
  });
};
```

ICE PKG 注册五个 build-script 任务：

+ `transform-esm`：默认启动
+ `transform-es2017`：默认启动
+ `transform-cjs`：当 transform 配置了 `formats: ['cjs']` 启动
+ `bundle-es5`：当 bundle 配置了 `formats: ['esm']` 时启动
+ `bundle-es2017`：当 bundle 配置了 `formats: ['es2017']` 时启动

当不指定任务名时，配置对所有任务生效：

```ts
import svelte from 'rollup-plugin-svelte';

const plugin = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  // 不指定 Task name
  onGetConfig((config) => {
    return {
      ...config,
      rollupPlugins: [
        svelte(/* ... */), // 编译 svelte 文件则会进行对应的
      ],
    };
  });
};
```

有以下参数可以配置：

### entry

+ 类型 `RollupOptions['input']`
+ 默认值 `./src | ./src/index.[j|t]sx?`

配置组件编译的入口，入口配置和 Rollup [input](https://rollupjs.org/guide/en/#input) 配置一致。

| 任务            | 默认值                |
| -------------- | -------------------  |
| transform-esm  | `./src`              |
| transform-es2017   | `./src`              |
| transform-cjs  | `./src`              |
| bundle-es5 | `./src/index[j|t]sx?`  |
| bundle-es2017  | `./src/index[j|t]sx?`  |


### outputDir

+ 类型 `string`
+ 默认值 `es | lib | dist`

配置组件编译的出口。

| 任务            | 默认值              |
| -------------- | -------------------|
| transform-esm   | `esm`               |
| transform-es2017   | `es2017`               |
| transform-cjs  | `cjs`              |
| bundle-es5 | `dist`             |
| bundle-es2017  | `dist`  |

### rollupPlugins

+ 类型：`rollup.Plugin[]`
+ 默认值：`[]`

配置额外的 [rollupPlugins](https://rollupjs.org/guide/en/#plugin-development)。

### rollupOptions

+ 类型：`RollupOptions`
+ 默认值：`{}`

当 [开启 bundle 模式](./guide/config#bundle)，可通过 `rollupOptions` 配置额外的 [rollup 配置](https://rollupjs.org/guide/en/#command-line-flags)。

当试图修改 `rollupOptions.plugins` 参数时，建议直接使用 [rollupPlugins](#rollupPlugins) 参数。

### babelPlugins

+ 类型：`babel.PluginItem[] | undefined`
+ 默认值：`undefined`

配置额外的 babel 插件。当配置此选项后，将会先使用 babel 对代码进行编译，然后再经过 swc 编译。

### swcCompileOptions

+ 类型：`swc.Config`
+ 默认值 `{}`

swc 编译选项。具体可参考 [swc 配置](https://swc.rs/docs/configuration/swcrc)。

### postcssOptions

+ 类型 `(options: PostCSSPluginConf) => PostCSSPluginConf`
+ 默认值 `undefined`

修改 [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss#options) 插件配置。

```ts
const plugin = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  // 不指定 Task name
  onGetConfig((config) => {
    config.postcssOptions = (options) => {
      return {
        ...options,
        extract: false,
      }
      return config;
    }
  });
};
```

### extensions

+ 类型 `string[]`
+ 默认值 `['.mjs', '.js', '.json', '.node', '.ts', '.tsx', '.mts', '.cjs', '.cts']`

配置解析的文件后缀名，这样在引入模块时不需要带后缀名。

### alias

+ 类型：`Record<string, string>`
+ 默认值：`{}`

配置模块引入的别名。

### define

+ 类型：`Record<string, string>`
+ 默认值：`{ 'process.env.NODE_ENV': '<NODE_ENV>' }`

配置注入到运行时的变量。

### sourcemap

+ 类型：`boolean | 'inline'`
+ 默认值：start 阶段为 `true`，build 阶段为 `false`

配置是否生成源码调试映射。

### bundle

仅在 [type] 为 `bundle` 的时候生效。

#### name

+ 类型：`string`
+ 默认值：`package.name`

bundle 导出名称。

#### filename

+ 类型：`string | ((options: { isES2017: boolean; format: Omit<TaskConfig['bundle']['formats'][number], 'es2017'>; taskConfig: TaskConfig; development?: boolean }) => string);`
+ 默认值：`index`

生成的文件名。

#### development

+ 类型：`boolean`
+ 默认值：`false`

是否生成 development 的产物。

#### format

+ 类型：`Array<'umd' | 'esm' | 'cjs' | 'es2017'>`
+ 默认值：`['esm', 'es2017']`

生成产物的格式。

#### minify

+ 类型：`boolean`
+ 默认值：start 阶段为 `false`，build 阶段为 `true`

是否压缩 JS 和 CSS 产物。

## onHook

通过 `onHook` 监听命令构建时事件，`onHook` 注册的函数执行完成后才会执行后续操作，可以用于在命令运行中途插入插件想做的操作：

```ts
const plugin = (api) => {
  const { onHook } = api;
  onHook('after.build.compile', (args) => {
    console.log(args.taskName, '编译结束');
  });
};
```

ICE PKG 插件提供以下生命周期钩子：

+ build 命令：

| 生命周期            | 参数                                                  | 调用时机              |
| ------------------- | ----------------------------------------------------- | --------------------- |
| before.build.load   | { args: CommandArgs; config: PkgConfig[] } | 获取所有任务配置后|
| before.build.run    | { args: CommandArgs; config: PkgConfig[]  } | 编译执行之前  |
| after.build.compile | { taskName: string; outputFiles: OutputFile[]; modules?: rollup.ModuleJSON[] } | 编译结束              |

+ start 命令

| 生命周期            | 参数                                                  | 调用时机              |
| ------------------- | ----------------------------------------------------- | --------------------- |
| before.start.load   | { args: CommandArgs; config: PkgConfig[] } | 获取所有任务配置后|
| before.start.run    | { args: CommandArgs; config: PkgConfig[]  } | 编译执行之前  |
| after.start.compile | { taskName: string; outputFiles: OutputFile[]; modules?: rollup.ModuleJSON[] } | 编译结束              |
