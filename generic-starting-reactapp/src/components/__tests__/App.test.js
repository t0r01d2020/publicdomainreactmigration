import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders buttons', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText(/A Bootstrap Button/i);
  expect(buttonElement).toBeInTheDocument();
});
