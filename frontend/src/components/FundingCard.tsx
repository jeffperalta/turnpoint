// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
import './FundingCard.css';

export type EligibilityCardProps = {
  title: string;
  description: string;
  eligibilitySummary?: string; 
  eligible: boolean;
};

export default function EligibilityCard({
  title,
  description,
  eligibilitySummary,
  eligible,
}: EligibilityCardProps) {
  // const Icon = eligible ? CheckCircleIcon : CancelIcon;

  return (
    <>
      <div className="funding-card">
        <div className="eligibility-icon">
          {/* <Icon
            fontSize="large"
            htmlColor={eligible ? '#c0f2c2ff' : '#d97171ff'} 
          /> */}
        </div>
        
        <div className="title">
          {title}
        </div>
        
        <div className="description--container">
          <p className="description">{description}</p>
          <div>
            <p>Eligibility</p>
            <p className="description">{eligibilitySummary}</p>
          </div>
        </div>
      </div>
    </>
    
  );
}