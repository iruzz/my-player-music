import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import '../styles/search.css';

import PlayListCheck from '../assets/icons/playlist_add_check.svg';
import PlayListAdd from '../assets/icons/playlist_add.svg';
import Favorite from '../assets/icons/favorite.svg';
import PlayCircle from '../assets/icons/play_circle.svg';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery().get('q') || '';
  const [songs, setSongs] = useState([]);
  const [results, setResults] = useState([]);
  const { setCurrentSong } = useContext(PlayerContext);

  const [favorites, setFavorites] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const togglePlaylist = (id) => {
    setPlaylist((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetch('/data/songsdummy.json')
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error('Gagal ambil data:', err));
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      const filtered = songs.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, songs]);

  return (
    <div className="search-page">
      <div className="result-wrapper">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="comic-card">
              <img src={item.img} alt="Album" />
              <div className="card-info">
                <h2>{item.title}</h2>
                <p>{item.artist}</p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  title="Putar Lagu"
                  onClick={() => setCurrentSong(item)}
                >
                  <img src={PlayCircle} alt="Play" className="icon-img" />
                </button>

                <button
                  className={`btn-icon ${favorites.includes(item.id) ? 'favorited' : ''}`} //pls wok perbaiki bagian icon ini, aku depresi parah, gk bisa benerin 
                  title="Favoritkan"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <img src={Favorite} alt="Favorite" className="icon-img" />
                </button>

                <div className="options-menu-wrapper">
                  <button className="btn-icon" title="Lainnya">⋮</button>
                  <div className="options-dropdown">
                    <p onClick={() => togglePlaylist(item.id)}>
                      <img
                        src={playlist.includes(item.id) ? PlayListCheck : PlayListAdd}
                        alt="Playlist"
                        className="icon-img-sm"
                      />
                      {playlist.includes(item.id)
                        ? ' Tersimpan di Playlist'
                        : ' Tambah ke Playlist'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-msg">⚠️ Tidak ada lagu ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
