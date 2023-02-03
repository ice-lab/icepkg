import * as React from 'react';
import Button from '@/components/Button';

export default function Component() {
  console.log(__DEV__);
  console.log(process.env.NODE_ENV);
  return (
    <>
      <h1 style={{ fontSize: '100rpx' }}>Hello World</h1>
      <Button>Hello</Button>
    </>
  );
}

export { default as Button } from '@/components/Button';
