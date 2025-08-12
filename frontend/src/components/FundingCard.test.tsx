import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EligibilityCard from './FundingCard';

// Mock MUI icons so we can assert which one is rendered and what props it gets
jest.mock('@mui/icons-material/CheckCircle', () => ({
  __esModule: true,
  default: (props: any) => {
    const { htmlColor, ...rest } = props;
    return <svg data-testid="check-icon" fill={htmlColor} {...rest} />
  },
}));
jest.mock('@mui/icons-material/Cancel', () => ({
  __esModule: true,
  default: (props: any) => {
    const { htmlColor, ...rest } = props;
    return <svg data-testid="cancel-icon" fill={htmlColor} {...rest} />
  },
}));

describe('EligibilityCard', () => {
  const baseProps = {
    title: 'NDIS Funding',
    description: 'Support for participants',
  };

  test('renders title, description, and eligibility summary', () => {
    render(
      <EligibilityCard
        {...baseProps}
        eligibilitySummary="Must be an Australian resident"
        eligible={true}
      />
    );

    expect(screen.getByText('NDIS Funding')).toBeInTheDocument();
    expect(screen.getByText('Support for participants')).toBeInTheDocument();
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(
      screen.getByText('Must be an Australian resident')
    ).toBeInTheDocument();
  });

  test('uses CheckCircle icon with green color when eligible', () => {
    render(<EligibilityCard {...baseProps} eligible={true} />);

    const check = screen.getByTestId('check-icon');
    expect(check).toBeInTheDocument();
    expect(check).toHaveAttribute('fill', '#c0f2c2ff');

    expect(screen.queryByTestId('cancel-icon')).not.toBeInTheDocument();
  });

  test('uses Cancel icon with red color when not eligible', () => {
    render(<EligibilityCard {...baseProps} eligible={false} />);

    const cancel = screen.getByTestId('cancel-icon');
    expect(cancel).toBeInTheDocument();
    expect(cancel).toHaveAttribute('fill', '#d97171ff');

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  test('gracefully renders when eligibilitySummary is omitted', () => {
    render(<EligibilityCard {...baseProps} eligible />);
    // The summary <p> exists but may be empty; ensure no crash and section label appears
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
  });
});