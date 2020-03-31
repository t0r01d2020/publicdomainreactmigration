import React from 'react';
import { render } from '@testing-library/react';
import AClassBasedComponent from '../components/AClassBasedComponent';
import BootstrapDefaultDropdown from '../components/BootstrapDefaultDropdown';


//Some Unit Tests of some of our components:

test('class-based component message', () => {
  const { getByText } = render(<AClassBasedComponent  />);
  const expectedClassCmpMsg = getByText(/YTD Revenue/);
  expect(expectedClassCmpMsg).toBeInTheDocument();
});

//A Unit test of the Bootstrap Dropdown:
test('Bootstrap example dropdown', () => {
  const { getByText } = render(<BootstrapDefaultDropdown />);
  const expectedDropdown = getByText(/Bootstrap Default Dropdown/);
  expect(expectedDropdown).toBeInTheDocument();
});
