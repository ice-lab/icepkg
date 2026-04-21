# CLI

## start

启动本地调试服务，监听文件变更并自动重新编译。配置文件变更时会自动重启。

```bash
$ ice-pkg start [options]
```

|         选项          |   类型    | 说明                          |
| :-------------------: | :-------: | ----------------------------- |
|  `--config <config>`  | `string`  | 指定配置文件路径              |
| `--rootDir <rootDir>` | `string`  | 指定应用运行的根目录          |
|     `--analyzer`      | `boolean` | Bundle 模式下开启体积构建分析 |
|    `--port <port>`    | `number`  | 覆盖预览服务端口号            |
|    `--host <host>`    | `string`  | 覆盖预览服务 host             |

## build

执行编译或打包构建，输出构建产物。

```bash
$ ice-pkg build [options]
```

|         选项          |   类型    | 说明                          |
| :-------------------: | :-------: | ----------------------------- |
|  `--config <config>`  | `string`  | 指定配置文件路径              |
| `--rootDir <rootDir>` | `string`  | 指定应用运行的根目录          |
|     `--analyzer`      | `boolean` | Bundle 模式下开启体积构建分析 |
