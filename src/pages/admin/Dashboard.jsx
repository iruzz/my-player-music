import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";
import UploadSong from './UploadSong'; // ✅ Komponen form upload lengkap

function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/requests/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Admin</h2>

      <h3>Request Lagu User</h3>
      <div className="request-list">
        {requests.length === 0 ? (
          <p>Tidak ada request lagu.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="request-item">
              <h4>{req.title}</h4>
              <p><strong>Artis:</strong> {req.artist}</p>
              {req.note && <p><strong>Catatan:</strong> {req.note}</p>}
              <div className="request-actions">
                <button className="accept" onClick={() => handleAccept(req.id)}>Terima</button>
                <button className="delete" onClick={() => handleDelete(req.id)}>Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3>Upload Lagu Baru</h3>
      {/* ✅ Gantikan form manual dengan komponen UploadSong */}
      <UploadSong />
    </div>
  );
}

export default AdminDashboard;
