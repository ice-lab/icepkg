import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Index from '../src/index';

test('test <Button /> component', () => {
  render(<Index />);
  expect(screen.getByTestId('title')).toHaveTextContent('Hello World');
});
