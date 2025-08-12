import { render, screen } from '@testing-library/react';
import Empty from './Empty';

describe('Empty component', () => {
  test('renders custom message', () => {
    render(<Empty message="There are no data" />);
    expect(screen.getByText(/There are no data/i)).toBeInTheDocument();
  });
});