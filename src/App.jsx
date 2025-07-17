import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './component/Navbar';
import MusicSection from './pages/MusicSection';
import FooterPlay from './component/FooterPlay';
import FooterInfo from './component/FooterInfo';
import Request from './pages/Request';
import Search from './pages/Search';
import CardPlayer from './pages/CardPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './component/PrivateRoutes';
import AdminDashboard from './pages/admin/Dashboard';
import UploadSong from './pages/admin/UploadSong';
import UserDashboard from './pages/UserDashboard';

function App() {
  const location = useLocation();
  const [showCardPlayer, setShowCardPlayer] = useState(false);

  const handleOpenCardPlayer = () => setShowCardPlayer(true);
  const handleCloseCardPlayer = () => setShowCardPlayer(false);

  const hideLayout = ['/login', '/register'];

  return (
    <>
      {!hideLayout.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <MusicSection title="New Songs" category="new" />
                <MusicSection title="Lagu Indonesia" category="indo" />
                <MusicSection title="Lagu Luar Negeri" category="luar" />
                <FooterInfo />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/request"
          element={
            <PrivateRoute>
              <Request />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/upload"
          element={
            <PrivateRoute>
              <UploadSong />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {showCardPlayer && <CardPlayer onClose={handleCloseCardPlayer} />}
      {!showCardPlayer &&
        !hideLayout.includes(location.pathname) &&
        location.pathname !== '/request' && (
          <FooterPlay onOpenCardPlayer={handleOpenCardPlayer} />
        )}
    </>
  );
}

export default App;
