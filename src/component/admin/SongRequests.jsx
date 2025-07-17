import React, { useEffect, useState } from 'react';

const SongRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/song-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setRequests(data);
    } else {
      console.error('❌ Gagal fetch request');
    }
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/song-requests/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRequests();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/song-requests/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRequests();
  };

  return (
    <div>
      <h2>Request Lagu dari User</h2>
      {requests.length === 0 ? (
        <p>Tidak ada request lagu.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <strong>{req.title}</strong> oleh {req.artist}
              <button onClick={() => handleAccept(req.id)}>Terima</button>
              <button onClick={() => handleDelete(req.id)}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongRequests;
