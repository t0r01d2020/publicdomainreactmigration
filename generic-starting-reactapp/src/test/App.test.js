import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders our custom component message', () => {
  const { getByText } = render(<App />);
  const expectedClassCmpMsg = getByText(/Hello from example class-based Component/);
  expect(expectedClassCmpMsg).toBeInTheDocument();
});


test('renders our Bootstrap example dropdown', () => {
  const { getByText } = render(<App />);
  const expectedDropdown = getByText(/Bootstrap Default Dropdown/);
  expect(expectedDropdown).toBeInTheDocument();
});



