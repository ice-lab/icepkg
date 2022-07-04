# 关于 ICE PKG

ICE PKG 是飞冰开源的 NPM 包开发解决方案，提供 [React 组件](/scenarios/react)、[Rax 组件](/scenarios/rax)、[Node 模块](/scenarios/node)、[前端类库](/scenarios/web)等多场景需求。

## 特性

- **📈 更快**：使用 [swc](https://swc.rs/docs/configuration/swcrc) 编译和压缩，提升数十倍编译速度
- **🎊 双模式**：同时提供 transform + bundle 两种输出模式
- **🅾️ 零配置**：无需任何配置，提供内建的 TypeScript、JSX 等构建支持
- **☄️ 面向未来**：提供 ES2017 产物，打包出面向现代浏览器支持的产物
- **☘️ 文档预览**：基于 [Docusaurus](https://docusaurus.io/) 提供预览文档、生成静态文档能力

### 更快

<figure style={{
  maxWidth: '800px',
  fontSize: '13px',
  lineHeight: '20px'
}}>
  <img src="https://img.alicdn.com/imgextra/i1/O1CN01MoY2ji23DGjyTw2Dh_!!6000000007221-2-tps-2972-638.png" alt="benchmark" />

<figcaption>Above: benchmark 使用 <a href="https://github.com/maoxiaoke/pkg-benchmark">飞冰 fusion pro</a> 模板</figcaption>
</figure>

### 双模式

社区的众多方案如 [microbundle](https://github.com/developit/microbundle)、[tsup](https://github.com/egoist/tsup) 均只支持 bundle (将众多文件打包成一个文件输出) 模式。但 bundle 模式[并非总是最佳选择](https://github.com/ice-lab/icepkg/issues/301)。其中最为**显著的问题**在于：**对 Tree-Shaking 不友好**，无用的依赖总是会被打包到最终的输出产物中，继而影响应用的体积。

@ice/pkg 除支持 bundle 模式外，默认支持 transform 模式（将文件挨个编译到输出目录）。

### ES2017 产物

为现代浏览器提供 es2017 产物，可以减少产物体积，亦可加快执行速度。更多内容参考 [指南 - 消费 es2017 产物](/guide/abilities#消费-es2017-产物)。

### 多场景

依赖 @ice/pkg 强大的 [双模式](#双模式) 能力，支持多类场景的额开发需求。

+ [React 组件开发](/scenarios/component)
+ [开发 Node 模块](/scenarios/node)
+ [开发前端 library](/scenarios/library)

### 文档预览

结合 [Docusaurus](https://docusaurus.io/)，ICE PKG 升级了文档预览的能力。更多内容参考 [指南 - 文档预览](/guide/preview)。

## 社区

如果你有疑问或者需要帮助，可以通过 [GitHub Discussions](https://github.com/ice-lab/icepkg/discussions/landing) 来寻求帮助。
