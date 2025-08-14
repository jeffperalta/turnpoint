import { Formik, Form, Field, ErrorMessage } from 'formik';
import {SchemaGroups, User} from '../../models/User';
import { AuthService } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import * as Yup from 'yup';


const authService = new AuthService();

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <Formik
        initialValues={ new User() }
        validationSchema={Yup.object(User.validationSchema(SchemaGroups.Login))}
        onSubmit={(values, { setSubmitting }) => {
          authService.logIn(User.deserialize(values))
            .then(res => {
              if(res.success) {
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
            <div>
              <label htmlFor="name">Email</label>
              <Field type="email" id="email" name="email" placeholder="Email" />
              <ErrorMessage
                name="email"
                render={msg => <div className="error-message">{msg}</div>}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password"  />
              <ErrorMessage
                name="password"
                render={msg => <div className="error-message">{msg}</div>}
              />
            </div>
            <div className='control--container'>
              <button type="submit" className='action--button' disabled={isSubmitting} >
                {isSubmitting ? 'Please wait…' : 'Login'}
              </button>
            </div>
            
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;