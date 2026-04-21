# 在 AI 中使用

ICE PKG 遵循 [llmstxt.org](https://llmstxt.org/) 标准，提供两个文件帮助 AI 工具理解项目文档：

| 文件          | 链接                               | 描述                                                   |
| ------------- | ---------------------------------- | ------------------------------------------------------ |
| llms.txt      | https://pkg.ice.work/llms.txt      | 包含所有文档页面的标题、链接和简要描述的结构化索引文件 |
| llms-full.txt | https://pkg.ice.work/llms-full.txt | 将每个文档页面的完整内容合并到单个文件中               |

## 如何选择

- **llms.txt**：体积较小，消耗 token 少，适合 AI 按需获取特定页面内容的场景
- **llms-full.txt**：包含完整文档内容，适合需要 AI 全面理解 ICE PKG 的场景，但会消耗更多 token，最适合支持大上下文窗口的 AI 工具
