import { createContext, useState, useCallback } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const index = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (index + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }, [currentSong, songs]);

  const prevSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const index = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (index - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [currentSong, songs]);

  return (
    <PlayerContext.Provider
      value={{
        songs,
        setSongs,
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        playSong,
        pauseSong,
        nextSong,
        prevSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
