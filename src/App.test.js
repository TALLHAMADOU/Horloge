import { render, screen } from '@testing-library/react';
import App from './App';

test('renders clock with hours, minutes and seconds labels', () => {
  render(<App />);
  const hoursLabel = screen.getByText(/HOURS/i);
  const minutesLabel = screen.getByText(/MINUTES/i);
  const secondsLabel = screen.getByText(/SECONDS/i);
  
  expect(hoursLabel).toBeInTheDocument();
  expect(minutesLabel).toBeInTheDocument();
  expect(secondsLabel).toBeInTheDocument();
});

test('renders current date', () => {
  render(<App />);
  const now = new Date();
  const year = now.getFullYear().toString();
  const yearElement = screen.getByText(new RegExp(year));
  expect(yearElement).toBeInTheDocument();
});
