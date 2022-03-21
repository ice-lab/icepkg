## 今天、明天

import Button from './Button.tsx';

### 这里是第一个 demo

```jsx preview
import React, { useState } from 'react';
import Button from './Button';

export default function App () {
  const [state, setState] = useState(0);

  const add = () => {
    setState(c => c + 1)
  }

  return (
    <div>
      {state}
      <button onClick={add}>Add</button>
      // 我这里加点东西，再加地阿内容个，这是真的真的可以随便
      <Button />
    </div>
  )
}
```

这里就真的展示源码的内容，不会渲染成组件。

```jsx
console.log('fsfsdfs');
```

## 这是第二个 demo

```tsx preview
import React, { useState } from 'react';
import Button from './Button';
import MyComponent from 'package-basic';

export default function App () {
  const [state, setState] = useState(0);

  const add = () => {
    setState(c => c + 1)
  }

  return (
    <div>
      {state}
      <button onClick={add}>Add</button>
      第二个 demo，这还差不多不会产生多个 sjx 啊吧
      <Button />
      <MyComponent />
    </div>
  )
}
```