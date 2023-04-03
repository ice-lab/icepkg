import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Test from '../src/components/Test';

test('test <Button /> component', () => {
  render(<Test />);
  expect(screen.getByTestId('title')).toHaveTextContent('Hello World');
});
