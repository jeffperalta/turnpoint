import React from 'react';

/** Minimal mock just for tests */
export const MemoryRouter: React.FC<{ initialEntries?: string[]; children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="mock-memory-router">{children}</div>
);

export const Link: React.FC<{ to: string; className?: string; children?: React.ReactNode }> = ({ to, children, ...rest }) => (
  <a href={to} {...rest}>{children}</a>
);

// Optional helpers if any component uses them
export const useNavigate = () => () => {};
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null, key: 'mock' });
export const useParams = () => ({});