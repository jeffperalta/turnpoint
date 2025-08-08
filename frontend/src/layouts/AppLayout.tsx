import { Outlet } from 'react-router-dom';
import AppHeader from '../components/UI/AppHeader';

export default function AppLayout() {
  return (
    <div className="app-container">
      <AppHeader />
      <main style={{ maxWidth: '960px', margin: '2rem auto' }}>
        <Outlet />
      </main>
    </div>
  );
}