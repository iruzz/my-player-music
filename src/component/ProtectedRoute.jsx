// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    // Kalau ada role dibutuhkan tapi user bukan role tsb
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
