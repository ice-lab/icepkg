## 后天

<!-- import Button from './Button.tsx'; -->

### 这里是第一个 demo

```jsx preview
import React, { useState } from 'react';

export default function App () {
  const [state, setState] = useState(0);

  const add = () => {
    setState(c => c + 1)
  }

  return (
    <div>
      {state}
      <a href="/">跳转</a>
      <button onClick={add}>Add</button>
    </div>
  )
}
```