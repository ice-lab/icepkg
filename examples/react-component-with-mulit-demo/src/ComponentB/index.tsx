import * as React from 'react';
import { Button } from '@alifd/next';

type ComponentProps = {
  title: string,
};

export default function ComponentB(props: ComponentProps) {
  const { title, ...others } = props;

  return (
    <div className="ExampleComponent" {...others}>
      <Button type="primary">fusion button</Button>
    </div>
  );
}
