import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';
import '@testing-library/jest-dom';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Admin component on the home page', () => {
    // Mock fetch to return a pending promise to avoid API call
    (fetch as any).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    // Check that the Admin component is rendered (look for its distinctive title)
    expect(
      screen.getByRole('heading', { name: /MarkLogic Admin \(Proxy\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to the admin page using Spring Boot proxy/i),
    ).toBeInTheDocument();
  });
});
