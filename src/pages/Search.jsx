import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

function SearchResults({ query }) {
  const { songs, setCurrentSong, setIsPlaying } = useContext(PlayerContext);

  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    // Scroll ke elemen lagu
    const el = document.getElementById(`song-${song.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Hapus query di URL (opsional)
    window.history.replaceState({}, '', '/');
  };

  return (
    <div className="search-dropdown">
      {filtered.map((song) => (
        <div
          key={song.id}
          className="search-item"
          onClick={() => handleSelect(song)}
          style={{ cursor: 'pointer' }}
        >
          {song.title} ({song.artist})
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
