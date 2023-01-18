# 开发插件

ICE PKG 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统。通过 build-scripts 插件，可以极大地扩展 ICE PKG 的能力。

## 插件示例

```js title="plugin.mjs"
/**
 * @type {import('@ice/pkg').Plugin}
 */
const plugin = (api, options) => {
  console.log('api: ', api);
};

export default plugin;
```

然后在 `build.config.mts` 中引入插件：

```diff
import { defineConfig } from '@ice/pkg';

export default defineConfig({
+ plugins: [
+   './plugin.mjs',
+ ],
});
```

## 插件 API

### context

`context` 包含构建时的上下文信息：

- `command`：当前运行命令，start/build/test
- `commandArgs`：script 命令执行时接受到的参数
- `rootDir`：项目根目录
- `userConfig`：用户在构建配置文件 build.config.mts 中配置的内容
- `pkg`：项目 package.json 中的内容

```js
const plugin = (api) => {
  console.log(api.context);
}
```

### onGetConfig

ICE PKG 会根据用户配置 transform 和 bundle 模式的输出产物格式，分别会注册以下任务：

+ `transform-esm`：默认启动
+ `transform-es2017`：默认启动
+ `transform-cjs`：当 transform 配置了 `formats: ['cjs']` 启动
+ `bundle-es5`：当 bundle 配置了 `formats: ['esm']` 或者 `formats: ['cjs']` 或者 `formats: ['umd']` 时启动
+ `bundle-es2017`：当 bundle 配置了 `formats: ['es2017']` 时启动

通过 `onGetConfig` API，可以修改每个 Task 任务的配置项。

当不指定任务名时，修改的配置会对所有任务生效：

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  // 不指定 Task name
  onGetConfig((config) => {
    return {
      ...config,
      entry: './component/index',
    };
  });
};
```

你也可以指定修改某个任务的配置，比如：

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  // 仅仅修改 transform-esm 任务的配置
  onGetConfig('transform-esm', config => {
    return ({
      ...config,
      entry: './component/index',
    });
  });
};
```

有以下参数可以配置：

#### entry

+ 类型：`string | string[] | { [entryAlias: string]: string }`
+ 默认值：`'./src/index'`

指定构建入口。支持配置单入口或者多个入口。

指定单个入口：

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    return ({
      ...config,
      entry: './component/index',
    });
  });
};
```

指定多个入口：

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    return ({
      ...config,
      // 1. 数组形式
      entry: ['./src/foo', './src/bar'],
      // 2. 对象形式，key 值作为 chunk name
      entry: {
        foo: './src/foo',
        bar2: './src/bar'
      }
    });
  });
};
```

#### define

+ 类型：`Record<string, string>`
+ 默认值：`{ 'process.env.NODE_ENV': 'development' | 'production', __DEV__: true | false }`

定义编译时环境变量，会在编译时被替换。注意：属性值会经过一次 `JSON.stringify()` 转换。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    return ({
      ...config,
      define: {
        VERSION: '1.0.0'
      },
    });
  });
};
```

#### sourcemap

+ 类型：`boolean | 'inline'`
+ 默认值：start 阶段为 `true`，build 阶段为 `false`

配置是否生成源码调试映射。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    return ({
      ...config,
      sourcemap: true,
    });
  });
};
```

#### alias

+ 类型：`Record<string, string>`
+ 默认值：`{}`

配置模块引入的别名。比如，将 `@` 指向 `./src` 目录：

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    return ({
      ...config,
      alias: {
        '@': './src',
      },
    });
  });
};
```

然后代码里 `import '@/foo'` 会被改成 `import '/path/to/your/project/foo'`。

#### modifyRollupOptions

+ 类型：`Array<(rollupOptions: RollupOptions) => RollupOptions>`
+ 默认值：`[]`

修改默认的 [Rollup 选项](https://rollupjs.org/guide/en/#rolluprollup)。

```js
import svelte from 'rollup-plugin-svelte';

const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    config.modifyRollupOptions ??= [];
    config.modifyRollupOptions.push((rollupOptions) => {
      rollupOptions.plugins.push(svelte({}));
      return rollupOptions;
    })
  });
};
```

#### babelPlugins

+ 类型：`babel.PluginItem[] | undefined`
+ 默认值：`undefined`

配置额外的 babel 插件。当配置此选项后，将会先使用 babel 对代码进行编译，然后再经过 swc 编译。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    config.babelPlugins = [];
  });
};
```

#### swcCompileOptions

+ 类型：`swc.Config`
+ 默认值：`{}`

swc 编译选项，会与默认的选项合并。具体编译选项可参考 [swc 配置](https://swc.rs/docs/configuration/swcrc)。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig(config => {
    config.swcCompileOptions = {
      // config
    };
  });
};
```

#### outputDir

> 仅对 bundle 模式生效。transform 模式按照配置的 format 值分别输出到对应目录，比如 esm、cjs、es2017

+ 类型：`string`
+ 默认值：`dist`

配置 bundle 模式下组件编译产物的输出目录。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', config => {
    return ({
      ...config,
      outputDir: 'build',
    });
  });
};
```

#### modifyStylesOptions

> 仅对 Bundle 模式生效

+ 类型 `Array<(options: StylesRollupPluginOptions) => StylesRollupPluginOptions>`
+ 默认值：`[]`

ICE PKG 默认使用 [rollup-plugin-styles](https://www.npmjs.com/package/rollup-plugin-styles) 处理样式文件，可以通过 `modifyStylesOptions` 方式修改插件的配置。

```js
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';

const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    config.modifyStylesOptions ??= [];
    config.modifyStylesOptions.push((stylesOptions) => {
      stylesOptions.plugins ||= [];
      (stylesOptions.plugins).push(PostcssPluginRpxToVw());
      return stylesOptions;
    })
    return config;
  });
};
```

#### extensions

> 仅对 Bundle 模式生效

+ 类型 `string[]`
+ 默认值：`['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx', '.mts', '.cjs', '.cts']`

配置解析的文件后缀名，这样在引入模块时不需要带后缀名，配置后会与默认值合并。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    config.extensions = ['.xtpl'];
    return config;
  });
};
```

#### name

> 仅对 Bundle 模式生效

+ 类型：`string`
+ 默认值：`package.name`

bundle 导出名称。一般用于 umd 产物中通过 `window[name]` 拿到产物模块内容。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    config.name = "ICEPKG";
    return config;
  });
};
```

#### modes

> 仅对 Bundle 模式生效

+ 类型：`Array<'development' | 'production' | string>`
+ 默认值：`['production']`

指定输出的产物是否经过压缩。默认情况下输出的产物是压缩过的（也就是开启了 `production`）。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    // 同时生成一份未压缩的产物和一份压缩产物
    config.modes = ['development', 'production'];
    return config;
  });
};
```

#### externals

> 仅对 Bundle 模式生效

+ 类型：`boolean | Record<string, string>`
+ 默认值：`{}`

设置哪些模块不打包，转而通过 `<script>` 或其他方式引入。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    return {
      ...config,
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    };
  });
};
```
#### minify

> 仅对 Bundle 模式生效

+ 类型：`boolean`
+ 默认值：start 阶段为 `false`，build 阶段为 `true`

是否压缩 JS 和 CSS 产物。

```js
const plugin = (api) => {
  const { onGetConfig } = api;
  onGetConfig('bundle-es5', (config) => {
    return {
      ...config,
      minify: false,
    };
  });
};
```

#### development（已废弃，请使用 modes）

> 仅对 Bundle 模式生效

+ 类型：`boolean`
+ 默认值：`false`

是否生成 development 的产物。

### onHook

通过 `onHook` 监听命令构建时事件，`onHook` 注册的函数执行完成后才会执行后续操作，可以用于在命令运行中途插入插件想做的操作：

```js
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
| after.build.compile | { taskName: string; outputFiles: OutputFile[]; outputs?: Array<rollup.RollupOutput['output']>; modules?: rollup.RollupCache['modules'] } | 编译结束              |

+ start 命令

| 生命周期            | 参数                                                  | 调用时机              |
| ------------------- | ----------------------------------------------------- | --------------------- |
| before.start.load   | { args: CommandArgs; config: PkgConfig[] } | 获取所有任务配置后|
| before.start.run    | { args: CommandArgs; config: PkgConfig[]  } | 编译执行之前  |
| after.start.compile | { taskName: string; outputFiles: OutputFile[]; modules?: rollup.ModuleJSON[] } | 编译结束              |

### registerTask

添加自定义 Task 任务：

```js
const plugin = (api) => {
  const { registerTask } = api;
  registerTask('transform-cjs', {
    type: 'transform', // 必填
  }); 
};
```

### getAllTask

获取所有 Task 任务：

```js
const plugin = (api) => {
  const { getAllTask } = api;
  const tasks = getAllTask(); 
};
```

### modifyUserConfig

修改用户配置内容：
```js
const plugin = (api) => {
  const { modifyUserConfig } = api;
  modifyUserConfig(key, value);
};
```

### registerUserConfig

为 `build.config.mts` 配置文件添加自定义字段：

```js
const plugin = (api) => {
  const { registerUserConfig } = api;
  registerUserConfig({
    name: 'custom-key',
    validation: 'boolean' // 可选，支持类型有 string, number, array, object, boolean
    setConfig: () => {
      // 该字段对于配置的影响，通过 onGetConfig 设置
    },
  });
};
```
