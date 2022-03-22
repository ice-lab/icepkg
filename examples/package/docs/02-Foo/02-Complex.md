## 后天

import Button from './Button.tsx';

### 这里是第一个 demo

```jsx preview title="/src/components/HelloCodeTitle.js"
import React, { useState } from 'react';

export default function App () {
  const [state, setState] = useState(0);

  const add = () => {
    setState(c => c + 1)
  }

  return (
    <div>
      {state}
      <button onClick={add}>Add</button>
    </div>
  )
}
```