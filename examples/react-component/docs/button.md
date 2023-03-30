# Button 组件

## 何时使用

这是一段 Button 组件使用描述

## 代码演示

### 按钮类型

按钮有两种视觉层次：主按钮、普通按钮。不同的类型可以用来区别按钮的重要程度。可以通过 `type` 属性置顶不同的视觉。

```tsx preview
import * as React from 'react';
import { Button } from 'example-pkg-react-component';

export default function App () {
  return (
    <div>
      <Button loading={false}>Normal</Button>
      <Button type="primary" loading={false}>Primary</Button>
    </div>
  )
}
```

### 添加事件

可以通过 `onClick` 设置点击按钮后的事件回调函数。

```tsx preview
import * as React from 'react';
import { Button } from 'example-pkg-react-component';

export default function App () {
  return (
    <div>
      <Button onClick={() => alert('Hello World')}>Normal</Button>
    </div>
  )
}
```

## API

<ReactDocgenProps path="../src/components/Button/index.tsx"></ReactDocgenProps>
