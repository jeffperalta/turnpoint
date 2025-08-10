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
import './CreateClientPage.css';

const updateSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Too short').required('Name is required'),
  identification: Yup.string().trim().required('Identification is required'),
  dob: Yup.date().max(new Date(), 'DOB must be in the past').required('Date of Birth is required'),
  main_language: Yup.string().trim().required('Primary Language is required'),
  secondary_language: Yup.string(),
  funding_source_id: Yup.number().required('Funding Source is required'),
});

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
          {({ isSubmitting }) => (
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

              <h3>Funding</h3>
              <div>
                <label htmlFor="funding_source_id">Funding Source</label>
                <Field as="select" id="funding_source_id" name="funding_source_id">
                  <option value="">Select a funding source…</option>
                  {dataSources.fundings.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </Field>
                <ErrorMessage
                  name="funding_source_id"
                  render={msg => <div className="error-message">{msg}</div>}
                />
              </div>
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