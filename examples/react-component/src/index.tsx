import * as React from 'react';

interface ComponentProps {
  /** Title of the example */
  title: string;
  /** Type of the example */
  type?: 'native' | 'hybird';
}

/**
 * This is an example component
 */
export default function ExampleComponent({ type = 'native', ...others }: ComponentProps) {
  return (
    <div className="ExampleComponent" {...others}>
      Hello ExampleComponent
    </div>
  );
}
