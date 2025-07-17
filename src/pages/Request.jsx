import { useState } from "react";
import axios from "axios";
import "../styles/Request.css";

function Request() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/requests",
        { title, artist },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Request berhasil dikirim!");
      setTitle("");
      setArtist("");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim request. Cek console.");
    }
  };

  return (
    <div className="request-form">
      <h2>Request Lagu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Judul Lagu:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nama Artis:</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <button type="submit">Kirim Request</button>
      </form>
    </div>
  );
}

export default Request;
