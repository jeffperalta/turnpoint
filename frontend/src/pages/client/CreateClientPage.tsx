import { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './CreateClientPage.css';
import WizardHeader from '../../components/WizardHeader';
import { Client, SchemaGroups } from '../../models/Client';
import ClientSummaryCard from './components/ClientSummaryCard';
import fundingService from '../../services/FundingService';
import clientService from '../../services/ClientService';
import { Funding } from '../../models/Funding';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getLanguages } from '../../utility/LangUtil';
import FundingField from './components/FundingField';
import FormTooltip from '../../components/UI/FormTooltip';

const STEPS = ['Basic info', 'Funding', 'Summary'];

const stepSchemas = [
  Yup.object(Client.validationSchema(SchemaGroups.Basic)),
  Yup.object(Client.validationSchema(SchemaGroups.Funding)),
  Yup.object({}), 
];

const fieldsByStep = [
  ['name', 'identification', 'dob', 'main_language', 'secondary_language'],
  ['funding_source_id', 'funding_eligibility'],
  [],
];

export default function CreateClientPage() {
  const [step, setStep] = useState(0);
  const [fundings, setFundings] = useState<Funding[]>([]);
  const navigate = useNavigate();

  const load = useCallback(async ()=> {
    const rows = await fundingService.getAll();
    setFundings(rows);
  }, []);
  
  useEffect(() => { load(); }, [load]);

  const next = async (validateForm: any, setTouched: any, values: any, errors: any) => {
    // Validate only fields in the current step
    const currentFields = fieldsByStep[step];
    const touchedMap = currentFields.reduce((acc, k) => ({ ...acc, [k]: true }), {});
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
    <div className="client-form-container">
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
          clientService.create(values)
            .then(res => {

              if(res.success) {
                toast.success(res.message);
                navigate('/clients');
              }else{
                toast.error(res.message);
                setSubmitting(false);
              }
            });
        }}
      >
        {({ values, errors, validateForm, setTouched, isSubmitting, setFieldValue, setFieldError }) => (
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
                  <label htmlFor="identification">
                    Identification
                    <FormTooltip message="Enter an official identification number or document reference." />
                  </label>
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

                <div className="form-row">
                  <div>
                    <label htmlFor="main_language">Main Language</label>
                    <Field as="select" id="main_language" name="main_language">
                      <option value="">Select a main language…</option>
                      {getLanguages().map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="main_language"
                      render={msg => <div className="error-message">{msg}</div>}
                    />
                  </div>

                  <div>
                    <label htmlFor="secondary_language">Secondary Language</label>
                    <Field as="select" id="secondary_language" name="secondary_language">
                      <option value="">Select a secondary language…</option>
                      {getLanguages().map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="secondary_language"
                      render={msg => <div className="error-message">{msg}</div>}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Funding */}
            {step === 1 && (
              <FundingField 
                formValue={values}
                fundings={fundings}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
              />
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
                  >Add Client
                  </button>
                )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

}