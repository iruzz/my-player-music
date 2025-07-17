// src/component/PrivateRoutes.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user')); // pastikan role disimpan di sini

  if (!token || !userData) {
    console.log("⛔ Belum login, redirect ke /login");
    return <Navigate to="/login" />;
  }

  // Kalau route ini butuh role (misalnya "admin"), tapi user bukan itu
  if (role && userData.role !== role) {
    console.log(`⛔ Akses ditolak. Role "${userData.role}" bukan "${role}". Redirect ke /`);
    return <Navigate to="/" />;
  }

  console.log("✅ Akses diizinkan:", userData);
  return children;
};

export default PrivateRoute;
