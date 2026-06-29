import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders clock interface', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Horloge simple/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Minuteur/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Chrono/i })).toBeInTheDocument();
});

test('renders timer mode', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Minuteur/i }));
  expect(screen.getByText(/Minuteur musical/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Démarrer/i })).toBeInTheDocument();
});
