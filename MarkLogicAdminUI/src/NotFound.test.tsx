import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFound from './NotFound';
import App from './App';
import '@testing-library/jest-dom';

describe('NotFound', () => {
  it('renders 404 error message', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for does not exist/i),
    ).toBeInTheDocument();
  });

  it('renders for a bad route in the app', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for does not exist/i),
    ).toBeInTheDocument();
  });
});
