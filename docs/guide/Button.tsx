import React, { useState } from 'react';

function Button() {
  const [count, setCount] = useState(0);
  return <div>
    <button onClick={() => setCount((c) => c + 1)}>Add count</button>
    <p>{count}</p>
  </div>;
}

export default Button;
