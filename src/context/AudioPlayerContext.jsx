import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "./HistoryContext.jsx";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  
  // Integration with HistoryContext to persist playback data
  const { updateProgress, getProgress } = useHistory();

  /**
   * Syncs the current playback time to the HistoryContext.
   * Memoized to prevent unnecessary re-renders in dependency arrays.
   */
  const saveCurrentProgress = useCallback(() => {
    if (audioRef.current && currentTrack && !isNaN(audioRef.current.duration)) {
        updateProgress(currentTrack.id, audioRef.current.currentTime, audioRef.current.duration);
    }
  }, [currentTrack, updateProgress]);

  /**
   * Resets the browser's Media Session API.
   * This ensures the OS media controls (e.g., lock screen) clear when playback stops.
   */
  const clearMediaSession = useCallback(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
    }
  }, []);

  const playTrack = (track) => {
    saveCurrentProgress(); // Save previous track progress before switching
    
    if (currentTrack?.id !== track.id) {
        setCurrentTrack(track);
    } 
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
        saveCurrentProgress();
        clearMediaSession();
    }
    setIsPlaying((prev) => !prev);
  };

  const seekTo = (time) => {
    if (audioRef.current && !isNaN(time) && time >= 0 && time <= audioRef.current.duration) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // ------------------------------------------------------
  // EFFECT 1: Source Management & History Restoration
  // Handles loading the file and seeking to the last known position.
  // ------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.file;
    audio.load();

    const savedProgress = getProgress(currentTrack.id);

    const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        
        // If history exists, resume from that timestamp
        if (savedProgress.progress > 0) {
            audio.currentTime = savedProgress.progress;
            setCurrentTime(savedProgress.progress);
        }
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [currentTrack, getProgress]); // Removed unnecessary setters from dependency array


  // ------------------------------------------------------
  // EFFECT 2: Playback State Synchronization
  // Syncs the React 'isPlaying' state with the HTML5 Audio API.
  // ------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.warn("Audio playback failed (likely due to autoplay policy):", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);


  // ------------------------------------------------------
  // EFFECT 3: Time Updates & Track Completion
  // Updates the UI progress bar and handles the 'ended' event.
  // ------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if(currentTrack) {
        // Mark as fully finished in history
        updateProgress(currentTrack.id, audio.duration, audio.duration);
      }
      setIsPlaying(false);
      setCurrentTime(0);
      clearMediaSession();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      saveCurrentProgress();
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [saveCurrentProgress, currentTrack, updateProgress, clearMediaSession]);


  // ------------------------------------------------------
  // EFFECT 4: Browser Unload Protection
  // Ensures progress is saved if the user refreshes or closes the tab while playing.
  // ------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isPlaying) {
        saveCurrentProgress();
        // Standard way to trigger a browser confirmation dialog (though modern browsers may ignore custom messages)
        event.preventDefault();
        event.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying, saveCurrentProgress]);

  const value = {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    audioRef,
    currentTime,
    duration,
    seekTo,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Hidden Audio Element - Controlled purely via React refs */}
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }} 
        controls={false} 
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export default AudioPlayerProvider;