import { useEffect, useState } from 'react';

// import './index.css';
// import './index.scss';

// import { multiply } from './test.js';

// eslint-disable-next-line no-undef
// console.log('测试一下', 'china');

// 这个功能需要 core.js 为 3.7 以后才会生效
// const a = 'abbbccccddd'.replaceAll('b', 'f');
// @ts-ignore
// console.log('a', a, __DEBUG__);


// 测试一下 define
// const add = (a) => a + __buildNumber;
// console.log('add', add);

// export { multiply };

// polyfills 简单验证
// const concatArr = [1, 2, 3].concat(8);

// async function testPromise() {
//   await Promise.resolve(true);
// }

// if (__DEV__) {
//   console.log('isDevelopment--');
// }

// console.log('testPromise', testPromise);

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('component-update', [1, 2, 3].concat(8));
    // throw new Error('fsfds');
  }, []);

  const clickHanle = () => {
    setCount((c: number) => c + 1);
  };

  return (
    <div>
      <button onClick={clickHanle}>Add Count</button>
      <p>{count}</p>
      <div>ABGCGSF</div>
    </div>
  );
};

export default App;
