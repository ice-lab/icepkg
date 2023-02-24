# 常见问题

## 为什么需要依赖 `@ice/jsx-runtime`

`@ice/pkg` 在 v1.5.0 版本以后，为支持能在内联样式中使用 rpx 单位，组件需要依赖 `@ice/jsx-runtime` 才能正常渲染。

```jsx
const Home = () => {
  return (
    <div style={{ fontSize: '100rpx' }}>Home</div>
  )
}
```

因此，Transform 模式下，需要 `@ice/jsx-runtime` 作为项目的 `dependencies`；Bundle 模式下需要把 `@ice/jsx-runtime` 作为项目的 `devDependencies`

```bash
# Transform 模式
$ npm i @ice/jsx-runtime --save
# Bundle 模式
$ npm i @ice/jsx-runtime --save-dev
```

## 为什么需要依赖 `@swc/helpers`

Transform 模式的产物代码中可能依赖一些 helper 函数用以支持目标环境。ICE PKG 默认将这些 helper 函数统一从 `@swc/helpers` 中导出使用，以减小产物代码体积。因此，当你的产物代码中引用了 `@swc/helpers` 时，请务必将 `@swc/helpers` 作为项目的 `dependencies`。

```bash
$ npm i @swc/helpers --save
```

## `Error: Can't resolve 'sass-loader' in ...`

出现这个报错的原因是在使用 docusaurus 插件时，docusaurus 无法正常 resolve 到 `sass-loader` 依赖。解决方案是暂时先安装一下依赖：

```bash
# 使用 scss
$ npm i sass-loader -D

# 使用 less
$ npm i less-loader -D
```