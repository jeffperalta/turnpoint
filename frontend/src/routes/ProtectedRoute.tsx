import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { useEffect, useState } from 'react';

const authService = new AuthService();

export default function ProtectedRoute() {
  const token = localStorage.getItem('sessionToken');
  const [state, setState] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    let mounted = true;
    authService.me()
      .then(() => mounted && setState('ok'))
      .catch(() => mounted && setState('fail'));

    return () => {
      mounted = false;
    }
  }, [])

  // If no token, redirect to login
  if (!token || state === 'fail') {
    return <Navigate to="/login" replace />
  }

  // Render child routes
  return <Outlet />;
}