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

因此需要将 `@ice/jsx-runtime` 作为项目的 `dependencies`（可执行命令 `npm i @ice/jsx-runtime --save` 安装依赖）。

## 为什么需要依赖 `@swc/helpers`

transform 模式的产物代码中可能依赖一些 helper 函数用以支持目标环境。ICE PKG 默认将这些 helper 函数统一从 `@swc/helpers` 中导出使用，以减小产物代码体积。因此，当你的产物代码中引用了 `@swc/helpers` 时，请务必将 `@swc/helpers` 作为项目的 `dependencies`（可执行命令 `npm i @swc/helpers --save` 安装依赖）。
