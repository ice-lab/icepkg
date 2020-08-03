# build-plugin-component-screenshot

build-plugin-component截图插件

### build.json 配置
默认会在云构建环境下执行（目前还不支持）

```
{
  "plugins": [
    "build-plugin-component-screenshot",
    "build-plugin-component",
    "..."
  ]
}

```

目前云构建环境还不支持截图能力，避免云构建环境下报错，需配置关闭云构建下的截图插件


```
{
  "plugins": [
    ["build-plugin-component-screenshot", {
      "cloud": false
    }],
    "build-plugin-component",
    "..."
  ]
}

```