# 发布

## 配置 package.json 字段

### files

### `main` & `module` & `exports`


推荐在 `package.json` 中配置 `exports` 产物导出：

```json
{
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "es2017": "./es2017/index.js",
      "default": "./esm/index.js",
    }
  }
}
```

:::tip
关于更多 `package.exports` 导出规则，可以查看 [Node.js 文档](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points)。
:::

### sideEffects

在 package.json 中配置 `sideEffects`：

```json
{
  "sideEffects": [

  ]
}
```

### 其他


## 更新

## 发布到 npm

ICE PKG 的脚手架默认把构建命令配置在 `prepublishOnly`：

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

执行下面的命令即可把发布到 npm：

```bash
# NPM 会先自动执行 prepublishOnly 脚本然后再发布
$ npm publish
```
