import * as React from 'react';
import Button from '@/Button';
import Avatar from '@/Avatar';

interface ComponentProps {
  /** Title for PkgReactComponentExample. */
  title: string;
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

export default function PkgReactComponentExample(props: ComponentProps) {
  const { title = '组件预览' } = props;

  return (
    <main>
      <h1>{title}</h1>
      <div>
        <h2>Button</h2>
        <div style={{ flexWrap: 'wrap', gap: '8px', display: 'flex' }}>
          <Button>Default Button</Button>
          <Button type="primary">Primary Button</Button>
        </div>
      </div>
      <br />
      <div>
        <h2>Avatar</h2>
        <Avatar />
      </div>
    </main>
  );
}
