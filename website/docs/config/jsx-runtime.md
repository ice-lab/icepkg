# jsxRuntime

- 类型：`'automatic' | 'classic'`
- 默认值：`'automatic'`

设置 [JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)的方式，并交给编译工具（SWC）编译处理 JSX 语法。

假设有这样一段 JSX 代码：

```jsx
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

当 `jsxRuntime` 的值是 `automatic`，编译结果是：

```js
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

当 `jsxRuntime` 的值是 `classic`，编译结果是：

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```
