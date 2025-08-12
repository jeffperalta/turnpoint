import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading component', () => {
  test('renders custom message', () => {
    render(<Loading text="Loading data..." />);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });
});