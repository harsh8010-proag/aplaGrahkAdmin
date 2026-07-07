import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const userData = localStorage.getItem('user_data');

  if (!token && !userData) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
