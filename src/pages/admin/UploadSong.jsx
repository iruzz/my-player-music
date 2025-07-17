import { useState } from "react";
import axios from "axios";
import '../../styles/AdminDashboard.css';
import "../../styles/UploadSong.css"; // ganti path sesuai struktur folder kamu


function UploadSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [category, setCategory] = useState("new"); // ✅ default value

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("category", category); // ✅ include category
    formData.append("audio", audioFile);
    formData.append("cover", coverFile);

    try {
      await axios.post("http://127.0.0.1:8000/api/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("✅ Lagu berhasil diupload!");
      setTitle("");
      setArtist("");
      setCategory("new");
      setAudioFile(null);
      setCoverFile(null);
    } catch (error) {
      console.error(error);
      alert("❌ Gagal upload lagu. Cek console.");
    }
  };

  return (
    <div className="upload-song">
      <h2>Upload Lagu Baru</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Judul Lagu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artis"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />

        
        <select
          value={category}
          onChange={(e) => {
            console.log("Selected category:", e.target.value);
            setCategory(e.target.value)
          }
        }
          required
        >
          <option value="new">New Song</option>
          <option value="indo">Lagu Indonesia</option>
          <option value="luar">Lagu Luar</option>
        </select>

        <input
          type="file"
          accept="audio/mp3"
          onChange={(e) => setAudioFile(e.target.files[0])}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload Lagu</button>
      </form>
    </div>
  );
}

export default UploadSong;
