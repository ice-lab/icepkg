import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

test('test Header component', () => {
  render(<Header />);
  expect(screen.getByTestId('title')).toHaveTextContent('Vitest Test');
});
