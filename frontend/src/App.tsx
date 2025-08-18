import './App.css';
import { User } from './models/User';
import authService from './services/AuthService';

function App() {
  
  const onLoginHandler = () => {
    authService.logIn(new User({
      email: 'test@email.com',
      password: 'Passw0rd!'
    }))
  }

  return (
    <div className="App">
      <div>
        <button onClick={onLoginHandler}>Login</button>
      </div>
    </div>
  );
}

export default App;
