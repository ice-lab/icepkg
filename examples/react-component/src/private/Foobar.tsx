import * as React from 'react';

export interface FoobarProps {
  foobar: string;
}

export function Foobar({ foobar }: FoobarProps) {
  return <div>{foobar}</div>;
}
