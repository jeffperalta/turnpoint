import { Link, useNavigate } from 'react-router-dom';
import './AppHeader.css';
import { getSessionToken } from '../../utility/SessionUtil';
import authService from '../../services/AuthService';

export default function AppHeader() {
  const navigate = useNavigate();
  const token = getSessionToken();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    authService.logout()
      .then(() => {
        navigate('/login')
      })
  }

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
            {token ? (
              <>
                <Link to="/clients" className='app-link'>
                  Clients
                </Link>
                <Link to="#" onClick={handleLogout}className='app-link'>
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login" className='app-link'>Login</Link>
            )}
            
          </div>
        </nav>
      </header>
  </>
}