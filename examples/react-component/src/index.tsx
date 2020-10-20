import * as React from 'react';

type ComponentProps = {
  title: string,
};

export default function ExampleComponent(props: ComponentProps) {
  const { type, ...others } = props;

  return (
    <div className="ExampleComponent" {...others}>Hello ExampleComponent</div>
  );
}
