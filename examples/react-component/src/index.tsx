import * as React from 'react';
import {DatePicker} from '@formily/next-components';

console.log(111, DatePicker);

type ComponentProps = {
  title: string,
};

export default function ExampleComponent(props: ComponentProps) {
  const { type, ...others } = props;

  return (
    <div className="ExampleComponent" {...others}>Hello ExampleComponent</div>
  );
}
