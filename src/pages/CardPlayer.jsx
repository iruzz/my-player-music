import '../styles/card-player.css'
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

import CloseIcon from '../assets/icons/cancel.svg';
import ShuffleIcon from '../assets/icons/shuffle.svg';
import RepeatIcon from '../assets/icons/repeat.svg';
import PrevIcon from '../assets/icons/previous.svg';
import NextIcon from '../assets/icons/next.svg';
import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import MoreVert from '../assets/icons/more_vert.svg';
import PlaylistAdd from '../assets/icons/playlist_add.svg';
import Favorite from '../assets/icons/favorite.svg';

function CardPlayer({ onClose }) {
  const { currentSong, isPlaying, togglePlay } = useContext(PlayerContext);

  if (!currentSong) return null;

  return (
    <div className="card-player-overlay">
      <div className="card-player">
        <button className="close-btn" onClick={onClose}>
          <img src={CloseIcon} alt="Close" />
        </button>

        <div className="more-menu-wrapper">
          <button className="more-menu-btn">
            <img src={MoreVert} alt="More" />
          </button>
          <div className="more-menu-dropdown">
            <p><img src={Favorite} alt="Fav" /> Tambah ke Favorit</p>
            <p><img src={PlaylistAdd} alt="Playlist" /> Tambah ke Playlist</p>
          </div>
        </div>

        <div className="album-wrapper">
          <img src={currentSong.img} alt={currentSong.title} />
        </div>

        <div className="track-info">
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist}</p>
        </div>

        <div className="controls">
          <button><img src={ShuffleIcon} alt="Shuffle" /></button>
          <button><img src={PrevIcon} alt="Previous" /></button>
          <button onClick={togglePlay}>
            <img src={isPlaying ? PauseIcon : PlayIcon} alt="Play/Pause" />
          </button>
          <button><img src={NextIcon} alt="Next" /></button>
          <button><img src={RepeatIcon} alt="Repeat" /></button>
        </div>

        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: '40%' }}></div>
        </div>
      </div>
    </div>
  );
}

export default CardPlayer;
