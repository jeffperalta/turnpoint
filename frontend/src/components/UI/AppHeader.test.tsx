import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppHeader from './AppHeader';

jest.mock('react-router-dom');

describe('AppHeader Component', () => {
  test('renders logo and company name', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    // Check logo image
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo192.png');

    // Check company name
    expect(
      screen.getByText(/TurnPoint Software/i)
    ).toBeInTheDocument();
  });

  test('renders navigation links with correct paths', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', {
      name: /TurnPoint Software/i,
    });
    expect(homeLink).toHaveAttribute('href', '/');

    const clientsLink = screen.getByRole('link', { name: /clients/i });
    expect(clientsLink).toHaveAttribute('href', '/clients');
  });
});