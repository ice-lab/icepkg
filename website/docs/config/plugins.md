# plugins

- 类型：`Array<string | [string, any?]>`
- 默认值：`[]`

ICE PKG 基于 [build-scripts](https://github.com/ice-lab/build-scripts) 插件系统，配置额外的 ICE PKG 插件，以进行更深度的工程定制。更多内容请参考[插件开发](../plugin/development)。

```ts title="build.config.mts"
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    // npm 依赖
    '@ice/plugin-docusaurus',
    // 相对路径
    './customPlugin.mjs',
    // 指定插件选项
    ['@ice/plugin-docusaurus', { title: 'Hello World' }],
  ],
});
```
