import * as React from 'react';
import Button from '@/components/Button';

export default function Component() {
  console.log(__DEV__);
  console.log(process.env.NODE_ENV);

  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <h1>Hello World</h1>
      <Button onClick={() => setVisible(!visible)}>Click Me to Set Visible</Button>

      <div>
        <div x-if={visible}>Hello</div>
        <div x-else>World</div>
      </div>
    </>
  );
}

export { default as Button } from '@/components/Button';
