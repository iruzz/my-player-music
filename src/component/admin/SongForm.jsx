import React, { useState, useRef, useEffect } from "react";

const SongForm = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [message, setMessage] = useState("");
  const audioRef = useRef();
  const coverRef = useRef();

  // Ambil CSRF Sanctum
  useEffect(() => {
    fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    if (audioRef.current.files[0]) {
      formData.append("audio", audioRef.current.files[0]);
    }
    if (coverRef.current.files[0]) {
      formData.append("cover", coverRef.current.files[0]);
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/admin/songs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Lagu berhasil ditambahkan!");
        setTitle("");
        setArtist("");
        audioRef.current.value = null;
        coverRef.current.value = null;
      } else {
        setMessage(data.message || "❌ Gagal menambahkan lagu.");
      }
    } catch (err) {
      setMessage("❌ Terjadi kesalahan saat mengirim.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] shadow-xl rounded-2xl p-8 max-w-3xl mx-auto my-10 border border-gray-200 dark:border-slate-700">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        🎵 Tambah Lagu Baru
      </h2>

      {message && (
        <div className="text-center mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Judul Lagu
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Artis
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File Audio (.mp3 / .wav)
          </label>
          <input
            type="file"
            accept=".mp3,.wav"
            ref={audioRef}
            className="w-full border border-dashed rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-600 text-gray-700 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Lagu (Opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={coverRef}
            className="w-full border border-dashed rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-600 text-gray-700 dark:text-gray-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          🚀 Upload Lagu
        </button>
      </form>
    </div>
  );
};

export default SongForm;
