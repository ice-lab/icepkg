import * as React from 'react';

type ComponentProps = {
  title: string,
};

export default function ComponentA(props: ComponentProps) {
  const { type, ...others } = props;

  return (
    <div className="ExampleComponent" {...others}>Hello ExampleComponent A</div>
  );
}
