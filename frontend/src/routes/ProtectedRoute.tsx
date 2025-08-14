import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('sessionToken');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Render child routes
  return <Outlet />;
}