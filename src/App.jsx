import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import '../src/styles/App.css';

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

// ✅ Import PlayerContext
import { PlayerContext } from './context/PlayerContext';

function App() {
  const location = useLocation();
  const [showCardPlayer, setShowCardPlayer] = useState(false);

  const handleOpenCardPlayer = () => setShowCardPlayer(true);
  const handleCloseCardPlayer = () => setShowCardPlayer(false);

  const hideLayout = ['/login', '/register'];

  // ✅ Ambil currentSong dari context
  const { currentSong } = useContext(PlayerContext);

  return (
    <>
      {!hideLayout.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <MusicSection className="mst" title="New Songs" category="new" />
                <MusicSection className="mst" title="Lagu Indonesia" category="indo" />
                <MusicSection className="mst" title="Lagu Luar Negeri" category="luar" />
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

      {/* ✅ FooterPlay muncul hanya kalau ada lagu & bukan halaman login/register/request */}
      {!showCardPlayer &&
        !hideLayout.includes(location.pathname) &&
        location.pathname !== '/request' &&
        currentSong && (
          <FooterPlay onOpenCardPlayer={handleOpenCardPlayer} />
        )}
    </>
  );
}

export default App;
