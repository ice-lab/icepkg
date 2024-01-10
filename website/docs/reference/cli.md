# CLI

## start

启动本地调试服务。

```bash
$ ice-pkg start [options]
```
|     选项     |   类型    | 说明                          |
| :----------: | :-------: | ----------------------------- |
| `--config <config>` | `string` | 指定配置文件路径 |
| `--rootDir <rootDir>` | `string` | 指定应用运行的根目录 |
| `--analyzer` | `boolean` | Bundle 模式下开启体积构建分析 |

## build

执行编译或者打包构建，输出构建产物。


```bash
$ ice-pkg build [options]
```

|     选项     |   类型    | 说明                          |
| :----------: | :-------: | ----------------------------- |
| `--config <config>` | `string` | 指定配置文件路径 |
| `--rootDir <rootDir>` | `string` | 指定应用运行的根目录 |
| `--analyzer` | `boolean` | Bundle 模式下开启体积构建分析 |
