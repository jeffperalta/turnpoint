import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Client } from '../../models/Client';
import { Funding } from '../../models/Funding';
import { useNavigate } from 'react-router-dom';
import { FundingService } from '../../services/FundingService';
import { ClientService } from '../../services/ClientService';
import Loading from '../../components/UI/Loading';
import { toast } from 'react-toastify';
import { getLanguages } from '../../utility/LangUtil';
import './CreateClientPage.css';
import FundingField from './components/FundingField';
import FormTooltip from '../../components/UI/FormTooltip';

const updateSchema = Yup.object(Client.validationSchema());
const fundingService = new FundingService();
const clientService = new ClientService();

export default function UpdateClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = Number(id);
  const [loading, setLoading] = useState<Boolean>(false);
  const [dataSources, setDataSources] = useState<{
    fundings: Funding[],
    client: Client | null
  }>({
    fundings: [],
    client: null
  });
  
  const load = useCallback(async () => {
    setLoading(true);

    let modifiedDataSources = {
      ...dataSources
    }

    const fundings = await fundingService.getAll();
    modifiedDataSources = {
      ...modifiedDataSources,
      fundings
    }

    if (!!id) {
      if (!isNaN(clientId)) {
        const notFound = () => {
          toast.error("Client data not found");
          navigate('/clients');
        }

        try{
          const clientData = await clientService.getById(clientId);
          if(clientData) {
            modifiedDataSources = {
              ...modifiedDataSources,
              client: clientData
            }
          }else{
            notFound();
          }
        }catch(e){
          notFound();
        }
      }
    }

    setDataSources(modifiedDataSources);
    setLoading(false);
  }, []);
    
  useEffect(() => { load(); }, [load]);

  const cancel = () => {
    navigate('/clients')
  }

  return (
    <div className="client-form-container">
      <h2>Update Client</h2>
      {
        loading && <Loading />
      }
      {
        !loading && 
        <Formik
          initialValues={dataSources.client || new Client()}
          validationSchema={updateSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Updated:', values)
            clientService.update(clientId, values)
              .then(res => {
                console.log(">>>HEY update response", res);
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
          {({ values, isSubmitting, setFieldValue, setFieldError }) => (
            <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Basic Info</h3>
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

              <h3>Funding</h3>
              <FundingField 
                formValue={values}
                fundings={dataSources.fundings}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
              />
              <div className='control--container'>
                <button 
                  type="button" 
                  onClick={cancel} 
                  className='cancel--button'
                >Cancel</button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='action--button'
                >Update</button>
              </div>
              
            </Form>
          )}
        </Formik>
      }
    </div>
  );
}