import * as React from 'react';
import { Button } from 'antd';

type ComponentProps = {
  title: string,
};

export default function ComponentA(props: ComponentProps) {
  const { title, ...others } = props;

  return (
    <div className="ExampleComponent" {...others}>
      Hello ExampleComponent A
      <Button type="primary">antd button</Button>
    </div>
  );
}
