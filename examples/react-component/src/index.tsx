import * as React from 'react';
import Button from '@/Button';
import Avatar from '@/Avatar';

interface ComponentProps {
  /** Title for PkgReactComponentExample. */
  title: string;
}

export default function PkgReactComponentExample(props: ComponentProps) {
  const { title = '组件预览' } = props;

  return (
    <main>
      {title}
      <div>
        <h2>Button</h2>
        <Button>Default Button</Button>
        <Button type="primary">Primary Button</Button>
      </div>
      <div>
        <h2>Avatar</h2>
        <Avatar />
      </div>
    </main>
  );
}
