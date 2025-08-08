import { Link } from 'react-router-dom';
import './AppHeader.css';

export default function AppHeader() {
  return <>
    <header className='app-header'>
        <nav>
          <div className="logo-container">
            <Link to="/"className='app-link'>
              MyAppLogo
            </Link>
          </div>
          <div className="link-container">
            <Link to="/clients" className='app-link'>
              Clients
            </Link>
          </div>
        </nav>
      </header>
  </>
}