import { Link } from 'react-router-dom';
import './AppHeader.css';

export default function AppHeader() {
  return <>
    <header className='app-header'>
        <nav>
          <div className="logo-container">
            <Link to="/" className='app-link'>
              <img 
                src="/logo192.png" 
                alt="Logo" 
                className="app-logo"
              />
              <span>TurnPoint Software - Company ABC</span>
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