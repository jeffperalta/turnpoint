import { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './CreateClientPage.css';
import WizardHeader from '../../components/UI/WizardHeader';
import { Client } from '../../models/Client';
import ClientSummaryCard from './components/ClientSummaryCard';
import { FundingService } from '../../services/FundingService';
import { Funding } from '../../models/Funding';

const STEPS = ['Basic info', 'Funding', 'Summary'];

const stepSchemas = [
  Yup.object({
    name: Yup.string().trim().min(2, 'Too short').required('Name is required'),
    identification: Yup.string().trim().required('Identification is required'),
    dob: Yup.date().max(new Date(), 'DOB must be in the past').required('Date of Birth is required'),
    main_language: Yup.string().trim().required('Primary Language is required'),
    secondary_language: Yup.string()
  }),
  Yup.object({
    funding_source_id: Yup.number().required('Funding Source is required'),
  }),
  Yup.object({}), 
];

const fieldsByStep = [
  ['name', 'identification', 'dob', 'main_language', 'secondary_language'],
  ['funding_source_id'],
  [],
];

const fundingService = new FundingService();

export default function CreateClientPage() {
  const [step, setStep] = useState(0);
  const [fundings, setFundings] = useState<Funding[]>([]);

  const load = useCallback(async ()=> {
    const rows = await fundingService.getAll();
    setFundings(rows);
  }, []);
  
  useEffect(() => { load(); }, [load]);
  useEffect(() => {console.log(fundings)}, [fundings])

  const next = async (validateForm: any, setTouched: any, values: any, errors: any) => {
    console.log(">>>HEY next", values, errors);
    // Validate only fields in the current step
    const currentFields = fieldsByStep[step];
    const touchedMap = currentFields.reduce((acc, k) => ({ ...acc, [k]: true }), {});
    console.log(">>>HEY currentFields, touchedMap", currentFields, touchedMap);
    setTouched(touchedMap, false);

    const stepErrors = Object.keys(errors || {}).filter((k) => currentFields.includes(k))

    if (stepErrors.length === 0) {
      // run a formal validation in case errors not yet computed
      const newErrors = await validateForm();
      const blocking = Object.keys(newErrors).filter((k) => currentFields.includes(k));
      if (blocking.length === 0) {
        setTimeout(() => {
          setStep((s) => s + 1);
        })
      }
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="create-client-page-container">
      <h2>Create New Client</h2>
      <WizardHeader 
        wizardSteps={STEPS}
        currentStep={step}
      />

      <Formik
        initialValues={ new Client() }
        validationSchema={stepSchemas[step]}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          console.log(">>>HEY submit", step)
          console.log('Created:', values);
          alert('Client created! Check console for payload.');
        }}
      >
        {({ values, errors, validateForm, setTouched, isSubmitting, handleSubmit }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Step 1: Basic info */}
            {step === 0 && (
              <>
                <div>
                  <label htmlFor="name">Name</label>
                  <Field id="name" name="name" placeholder="Name" />
                  <ErrorMessage
                    name="name"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
                <div>
                  <label htmlFor="identification">Identification</label>
                  <Field id="identification" name="identification" placeholder="Identification" />
                  <ErrorMessage
                    name="identification"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth</label>
                  <Field id="dob" type="date" name="dob" />
                  <ErrorMessage
                    name="dob"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
                <div>
                  <label htmlFor="main_language">Primary Language</label>
                  <Field id="main_language" name="main_language" placeholder="Main Language"  />
                  <ErrorMessage
                    name="main_language"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
                <div>
                  <label htmlFor="secondary_language">Secondary Language</label>
                  <Field id="secondary_language" name="secondary_language" placeholder="Secondary Language" />
                  <ErrorMessage
                    name="secondary_language"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
              </>
            )}

            {/* Step 2: Funding */}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="funding_source_id">Funding Source</label>
                  <Field as="select" id="funding_source_id" name="funding_source_id">
                    <option value="">Select a funding source…</option>
                    {fundings.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="funding_source_id"
                    render={msg => <div className="error-message">{msg}</div>}
                  />
                </div>
              </>
            )}

            {/* Step 3: Summary */}
            {
              step === 2 && 
              <ClientSummaryCard 
                client={values} 
                fundings={fundings} 
              />
            }

            <div className='control--container'>
              <button 
                type="button" 
                onClick={back} 
                disabled={step === 0} 
                className='cancel--button'
                style={{ 
                  background: step === 0 ? '#eee' : '#fafafa', 
                  cursor: step === 0 ? 'not-allowed' : 'pointer' 
                }}>Back</button>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => next(validateForm, setTouched, values, errors)}
                    className='action--button'>Next</button>
                ) : (
                  <button
                    type="submit"
                    // onClick={handleSubmit}
                    disabled={isSubmitting}
                    className='action--button'
                  >Register Client
                  </button>
                )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

}