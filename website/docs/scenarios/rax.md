# Rax 组件

## 初始化 Rax 组件项目

```bash
$ npm init @ice/pkg rax-component
```

会在当前目录下新建 rax-component 文件夹并在其中初始化 Rax 组件项目，其文件目录结构如下：

```shell
.
├── README.md
├── build.config.mts
├── docs
│   ├── index.md 
│   ├── usage.js
│   ├── usage.md
│   └── usage.module.css
├── package.json
├── src                      
│   ├── index.module.css    
│   ├── index.tsx
│   └── typings.d.ts
└── tsconfig.json
```


## 使用 Rax 组件

```ts
import { createElement } from 'rax';
import MyComponent from 'my-component';

export default function App() {
  return (
    <div>
      <MyComponent />  
    </div>
  );
}
```

:::warning
Rax 组件在开发预览时实际底层运行时为 React，而在执行 `npm run build` 后生成的构建产物仍为 Rax 组件，仍可应用于 Rax 应用项目中。
