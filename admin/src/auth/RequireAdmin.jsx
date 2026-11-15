import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import SessionLoading from './SessionLoading.jsx';

export default function RequireAdmin() {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <SessionLoading />;
  if (status !== 'authenticated' || user?.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: { pathname: location.pathname, search: location.search, hash: location.hash } }} />;
  }
  return <Outlet />;
}
