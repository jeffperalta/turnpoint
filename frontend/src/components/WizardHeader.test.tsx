import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WizardHeader from './WizardHeader';

describe('WizardHeader', () => {
  test('renders nothing when wizardSteps is empty', () => {
    render(<WizardHeader wizardSteps={[]} currentStep={0} />);
    expect(screen.queryAllByTestId('step-container')).toHaveLength(0);
  });

  test('renders all steps with correct numbers and labels', () => {
    render(<WizardHeader wizardSteps={['One', 'Two', 'Three']} currentStep={0} />);

    // Labels
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();

    // Step numbers (1-based)
    expect(screen.getByText('1')).toHaveClass('step');
    expect(screen.getByText('2')).toHaveClass('step');
    expect(screen.getByText('3')).toHaveClass('step');
  });

  test('applies active label to currentStep and completed class up to currentStep', () => {
    const { container } = render(
      <WizardHeader wizardSteps={['A', 'B', 'C', 'D']} currentStep={2} />
    );

    // Completed: indices 0..2 (3 elements)
    const completed = container.querySelectorAll('.step.step--completed');
    expect(completed).toHaveLength(3);

    // Active label only at index 2
    const activeLabels = container.querySelectorAll('.label--active');
    expect(activeLabels).toHaveLength(1);
    expect(activeLabels[0]).toHaveTextContent('C');

    // Non-active labels for others
    const labels = container.querySelectorAll('.label, .label--active');
    expect(labels).toHaveLength(4);
  });

  test('shows connector lines between steps (steps - 1)', () => {
    const { container } = render(
      <WizardHeader wizardSteps={['First', 'Second', 'Third']} currentStep={1} />
    );
    const lines = container.querySelectorAll('.line');
    expect(lines).toHaveLength(2);
  });

  test('when currentStep is 0, only first step is active and completed count is 1', () => {
    const { container } = render(
      <WizardHeader wizardSteps={['A', 'B', 'C']} currentStep={0} />
    );
    expect(container.querySelectorAll('.step.step--completed')).toHaveLength(1);

    const active = container.querySelectorAll('.label--active');
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent('A');
  });

  test('when currentStep exceeds last index, all steps are completed and no active label', () => {
    const { container } = render(
      <WizardHeader wizardSteps={['A', 'B', 'C']} currentStep={10} />
    );
    expect(container.querySelectorAll('.step.step--completed')).toHaveLength(3);
    expect(container.querySelectorAll('.label--active')).toHaveLength(0);
  });
});