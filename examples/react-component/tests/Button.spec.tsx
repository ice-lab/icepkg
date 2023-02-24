import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../src/components/Button';

test('test <Button /> component', () => {
  render(<Button>PKG</Button>);
  expect(screen.getByTestId('normal-button')).toHaveTextContent('PKG');
});
