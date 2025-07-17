import { useRef, useContext, useEffect, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import PlayCircle from '../assets/icons/play_circle.svg';
import '../styles/MusicSection.css';
import '../styles/Global.css';

function MusicSection({ title = "New Songs", category = "new" }) {
  const carouselRef = useRef();
  const { setCurrentSong, setSongs, setIsPlaying } = useContext(PlayerContext);
  const [songsData, setSongsData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:8000/api/songs', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Gagal ambil data: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        const baseUrl = 'http://127.0.0.1:8000/storage/';
        const updatedSongs = data.data.map(song => ({
          ...song,
          img: baseUrl + song.cover_path,
          audio: baseUrl + song.audio_path,
        }));

        // filter berdasarkan kategori
        const filtered = updatedSongs.filter(song => {
          switch (category) {
            case 'new':
              return song.category === 'new';
            case 'indo':
              return song.category === 'indo';
            case 'luar':
              return song.category === 'luar';
            default:
              return false;
          }
        });

        setSongsData(filtered);
        setSongs(prev => [...prev, ...filtered]); // gabung semua lagu
      })
      .catch(err => console.error('Gagal ambil data:', err));
  }, [category, setSongs]);

  const handlePlay = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const scrollCarousel = (direction) => {
    const scrollAmount = 200;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollAmount * direction;
    }
  };

  return (
    <section className="music-section">
      <div className="section-header">
      <h2 className="section-title bakso-title">{title}</h2>

      </div>

      <div className="carousel-wrapper">
        <button className="scroll-btn left" onClick={() => scrollCarousel(-1)}>&lt;</button>

        <div className="music-carousel" ref={carouselRef}>
          {songsData.length > 0 ? (
            songsData.map((song, index) => (
              <div className="music-card" key={index}>
                <div className="album-container">
                  <img src={song.img} alt={song.title} className="album-img" />
                  <button
                    className="album-play-btn"
                    onClick={() => handlePlay(song)}
                    title="Play"
                  >
                    <img src={PlayCircle} alt="Play" />
                  </button>
                </div>
                <p>{song.title}</p>
              </div>
            ))
          ) : (
            Array.from({ length: 10 }).map((_, i) => (
              <div className="music-card placeholder" key={i}></div>
            ))
          )}
        </div>

        <button className="scroll-btn right" onClick={() => scrollCarousel(1)}>&gt;</button>
      </div>
    </section>
  );
}

export default MusicSection;
