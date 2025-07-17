import '../styles/FooterPlay.css';
import { useContext, useRef, useState, useEffect } from 'react';
import { PlayerContext } from '../context/PlayerContext';

import Play from '../assets/icons/play.svg';
import Pause from '../assets/icons/pause.svg';
import Forward from '../assets/icons/next.svg';
import Previous from '../assets/icons/previous.svg';
import Shuffle from '../assets/icons/shuffle.svg';
import Repeat from '../assets/icons/repeat.svg';

function FooterPlay({ setShowCard, setCurrentCardSong }) {
  const { currentSong, setCurrentSong, songs } = useContext(PlayerContext);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audio || currentSong.src;
    audio.load();

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Auto play blocked:', err);
        setIsPlaying(false);
      }
    };

    playAudio();
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };

    const setMeta = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setMeta);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setMeta);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isDragging, repeatMode, currentSong, songs]);

  // 🎹 Keyboard control: Space = toggle play, Left = previous, Right = next
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName;
      const isFormInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (isFormInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentSong, songs]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlay = (e) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    if (!songs || !currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (isShuffled) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    setCurrentSong(songs[nextIndex]);
  };

  const handlePrevious = () => {
    if (!songs || !currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;

    let prevIndex;
    if (isShuffled) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === currentIndex);
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    setCurrentSong(songs[prevIndex]);
  };

  const toggleShuffle = () => setIsShuffled(!isShuffled);

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleFooterClick = () => {
    if (setShowCard && setCurrentCardSong && currentSong) {
      setShowCard(true);
      setCurrentCardSong(currentSong);
    }
  };

  return (
    <div className="footer-player" onClick={handleFooterClick}>
      <audio ref={audioRef} />

      <div className="track-info">
        {currentSong ? (
          <>
            <img src={currentSong.img || currentSong.cover} alt="cover" className="track-thumbnail" />
            <div className="track-details">
              <div className="track-title">{currentSong.title}</div>
              <div className="track-artist">{currentSong.artist}</div>
            </div>
          </>
        ) : (
          <>
            <div className="track-thumbnail skeleton"></div>
            <div className="track-details">
              <div className="track-title skeleton-text">No song selected</div>
              <div className="track-artist skeleton-text">Select a song to play</div>
            </div>
          </>
        )}
      </div>

      <div className="player-controls" onClick={(e) => e.stopPropagation()}>
        <button className={`control-btn ${isShuffled ? 'active' : ''}`} onClick={toggleShuffle}>
          <img src={Shuffle} alt="Shuffle" />
        </button>
        <button className="control-btn" onClick={handlePrevious}>
          <img src={Previous} alt="Previous" />
        </button>
        <button className="control-btn play-btn" onClick={togglePlay}>
          <img src={isPlaying ? Pause : Play} alt={isPlaying ? "Pause" : "Play"} />
        </button>
        <button className="control-btn" onClick={handleNext}>
          <img src={Forward} alt="Next" />
        </button>
        <button className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`} onClick={toggleRepeat}>
          <img src={Repeat} alt="Repeat" />
          {repeatMode === 'one' && <span className="repeat-badge">1</span>}
        </button>
      </div>

      <div className="track-progress" onClick={(e) => e.stopPropagation()}>
        <span>{formatTime(currentTime)}</span>
        <div
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        >
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default FooterPlay;
