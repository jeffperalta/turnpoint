import './WizardHeader.css';

type WizardHeaderProps = {
  wizardSteps?: string[];
  currentStep?: number;
};

export default function WizardHeader({
  wizardSteps = [],
  currentStep = 0,
  ...props
}: WizardHeaderProps) {
  return(
    <div className="wizard-header-container">
      {wizardSteps.map((label, i) => (
        <div key={label} className='step--container'>
          <div className={'step ' + (i <= currentStep ? 'step--completed' : '')}>{i + 1}</div>
          <span className={i === currentStep ? 'label--active' : 'label'}>{label}</span>
          {i < wizardSteps.length - 1 && <div className='line' />}
        </div>
      ))}
    </div>
  )
}