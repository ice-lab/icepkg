# 关于

## 这是什么

@ice/pkg 是飞冰团队对外开源的 NPM 包开发解决方案，提供 React 组件开发、Node 模块开发、前端 Library 多场景需求。

## 特性

- **更快**：代码使用 [swc](https://swc.rs/docs/configuration/swcrc) 编译和压缩，提升数十倍编译速度。
- **支持 transform 和 bundle 双模式**：提供多种场景解决方案。
- **零配置**：无需任何配置，提供 TypeScript 和 React JSX 支持。
- **面向未来**：提供 es2017 产物，可打包出面向现代浏览器支持的产物。
- **更强大的预览能力**：默认使用 [Docusaurus](https://docusaurus.io/) 作为组件预览，文档生成方案。

### 更快

<figure style={{
  maxWidth:'800px',
  fontSize:'13px',
  lineHeight:'20px'
}}>
  <img src="https://img.alicdn.com/imgextra/i3/O1CN01qfRmm128fH2PXwmDa_!!6000000007959-1-tps-1342-268.gif" alt="benchmark" />

<figcaption>Above: benchmark 使用 <a href="https://github.com/maoxiaoke/pkg-benchmark">飞冰 fusion pro</a> 模板。单位 ms。</figcaption>
</figure>

### 双模式

社区的众多方案如 [microBunlde](https://github.com/developit/microbundle)、[tsup](https://github.com/egoist/tsup) 均只支持 bundle (将众多文件打包成一个文件输出) 模式。但 bundle 模式[并非总是最佳选择](https://github.com/ice-lab/icepkg/issues/301)。其中最为**显著的问题**在于：**对 Tree-Shaking 不友好**，无用的依赖总是会被打包到最终的输出产物中，继而影响应用的体积。

@ice/pkg 除支持 bundle 模式外，默认支持 transform 模式（将文件挨个编译到输出目录）。

### es2017 产物

为现代浏览器提供 es2017 产物，可以减少产物体积，亦可加快执行速度。更多内容参考。

### 强大的预览能力

结合 [Docusaurus](https://docusaurus.io/)，我们升级了文档预览的能力。更多内容参考 [指南 - 文档预览](/guide/preview)。

## 社区

如果你有疑问或者需要帮助，可以通过 [GitHub Discussions](https://github.com/ice-lab/icepkg/discussions/landing) 来寻求帮助。
