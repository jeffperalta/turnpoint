import { render, screen } from '@testing-library/react';
import FormTooltip from './FormTooltip';

// Mock Tooltip to just render the title prop so we can check the message
jest.mock('@mui/material', () => ({
  __esModule: true,
  Tooltip: ({ title, children }: any) => (
    <div>
      <span data-testid="tooltip-title">{title}</span>
      {children}
    </div>
  ),
  IconButton: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

// Mock the icon so we don't need MUI's SVG
jest.mock('@mui/icons-material/InfoOutlined', () => ({
  __esModule: true,
  default: () => <svg data-testid="mock-info-icon" />
}));

describe('FormTooltip', () => {
  test('renders the message in the tooltip', () => {
    render(<FormTooltip message="Hello tooltip" />);
    expect(screen.getByTestId('tooltip-title')).toHaveTextContent('Hello tooltip');
  });

  test('renders empty when no message is provided', () => {
    render(<FormTooltip />);
    expect(screen.getByTestId('tooltip-title')).toHaveTextContent('');
  });
});