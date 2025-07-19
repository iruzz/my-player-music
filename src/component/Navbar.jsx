import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import '../styles/search.css';

// ICONS
import SearchIcon from '../assets/icons/search.svg';
import HamIcon from '../assets/icons/ham_menu.svg';
import CloseIcon from '../assets/icons/cancel.svg';
import Profile from '../assets/icons/profil.svg';
import Settings from '../assets/icons/settings.svg';
import Login from '../assets/icons/login.svg';
import Request from '../assets/icons/request.svg';

import { PlayerContext } from '../context/PlayerContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allSongs, setAllSongs] = useState([]);

  const menuRef = useRef(null);
  const hamRef = useRef(null);
  const navigate = useNavigate();

  const { setCurrentSong, setIsPlaying } = useContext(PlayerContext);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamRef.current &&
        !hamRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Ambil data lagu
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:8000/api/songs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Body: ${text}`);
        }
        return response.json();
      })
      .then((response) => {
        const songs = response.data || [];
        const baseUrl = 'http://127.0.0.1:8000/storage/';
        const formatted = songs.map(song => ({
          ...song,
          img: baseUrl + song.cover_path,
          audio: baseUrl + song.audio_path,
          title: song.title,
        }));
        setAllSongs(formatted);
      })
      .catch(err => console.error('Gagal ambil lagu:', err));
  }, []);

  // 🔍 Filter pencarian
  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const results = allSongs.filter((lagu) =>
      lagu.title.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    setShowDropdown(true);
  }, [query, allSongs]);

  // ✅ Klik hasil search = scroll + set lagu
  const handleClickResult = (judul) => {
    const target = allSongs.find(song => song.title === judul);
    if (target) {
      const el = document.getElementById(`song-${target.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Optional: auto play lagu
      setCurrentSong(target);
      setIsPlaying(true);
    }

    setQuery('');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('✅ Berhasil logout!');
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <Link to="/" className='aa' data-text="Home">
         <h1 className='titleIcon'>Mofy</h1>
      </Link>

      <form onSubmit={(e) => e.preventDefault()} className="searchbar">
        <div className="searchkolom">
          <input
            type="text"
            placeholder="Cari Lagu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="searchcolum"
          />
          {showDropdown && filtered.length > 0 && (
            <div className="dropdown-search">
              {filtered.map((item, idx) => (
                <div
                  key={idx}
                  className="result-item"
                  onClick={() => handleClickResult(item.title)}
                >
                  <img src={item.img} alt="cover" />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <img src={SearchIcon} alt="Search" className='svg' />
      </form>

      <div className='ham' onClick={toggleMenu} ref={hamRef}>
        <img src={menuOpen ? CloseIcon : HamIcon} alt="menu" className="svg" />
      </div>

      {menuOpen && (
        <div className="dropdown-menu" id="dropdownMenu" ref={menuRef}>
          <Link to="/request"><img src={Request} alt="" className='dd' />Add Music</Link>
          <Link onClick={handleLogout} className="logout-btn">
            <img src={Login} alt="Logout" className="dd" />Logout
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
