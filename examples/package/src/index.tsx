import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const addCount = () => {
    setCount((c: number) => c + 1);
  };

  return (
    <div>
      <button onClick={addCount}>Add Count</button>
      <p>{count}</p>
    </div>
  );
};

export default App;
