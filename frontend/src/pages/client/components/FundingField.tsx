import { useState, useEffect, useCallback } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Funding } from '../../../models/Funding';
import { FundingService } from '../../../services/FundingService';
import Empty from '../../../components/UI/Empty';
import EligibilityCard from '../../../components/FundingCard';

const fundingService = new FundingService();

interface FundingFieldProps {
  fundings: Funding[];
  formValue: any,
  setFieldValue: any;
  setFieldError: any;
}

export default function FundingField({
  fundings,
  formValue,
  setFieldValue,
  setFieldError,
  ...props
}: FundingFieldProps) {
  const [fundingEligibility, setFundingEligibility] = useState<Funding | null>(null);

  const checkEligibility = useCallback(async (fundingId: string) => {
    if(fundingId) {
      setFundingEligibility(null);
      const result = await fundingService.checkElibility({
        fundingId: fundingId
      });
      const fundingEligibilityResults = result.data as Funding | null;
      setFundingEligibility(fundingEligibilityResults);
      setFieldValue("funding_source_id", fundingId);
      const eligibilityValue = fundingEligibilityResults?.eligibilityResult ? "valid":"invalid";
      setFieldValue("funding_eligibility", eligibilityValue);
      if(eligibilityValue==="valid") setFieldError("funding_eligibility",  undefined)
    }else{
      setFieldValue("funding_source_id", fundingId);
      setFieldValue("funding_eligibility", "");
      setFieldError("funding_eligibility",  undefined)
    }
  }, []);

  useEffect(() => {
    if(formValue?.funding_source_id) {
      checkEligibility(formValue?.funding_source_id);
    }
  }, [formValue, checkEligibility]);

  return (
    <>
      <div>
        <label htmlFor="funding_source_id">Funding Source</label>
        <Field 
          as="select" 
          id="funding_source_id" 
          name="funding_source_id"
          onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
            checkEligibility(e.target.value)
          }}
        >
          <option value="">Select a funding source…</option>
          {fundings.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Field>
        <ErrorMessage
          name="funding_source_id"
          render={msg => <div className="error-message">{msg}</div>}
        />
        <Field type="hidden" name="funding_eligibility" />
        <ErrorMessage
          name="funding_eligibility"
          render={msg => <div className="error-message">{msg}</div>}
        />
      </div>
      <div>
        {
          !fundingEligibility && 
          <Empty 
            message='Please select a funding source'
          />
        }
        {
          !!fundingEligibility && 
          <EligibilityCard
            title={fundingEligibility?.fullName}
            description={fundingEligibility?.description}
            eligibilitySummary={fundingEligibility?.eligibilityMessage}
            eligible={fundingEligibility?.eligibilityResult}
          />
        }
      </div>
    </>
  )
}