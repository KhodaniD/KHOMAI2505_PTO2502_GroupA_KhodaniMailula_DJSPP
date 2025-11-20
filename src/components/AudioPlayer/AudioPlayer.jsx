import React, { useState } from "react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { FaPlay, FaPause } from "react-icons/fa";
import styles from "./AudioPlayer.module.css";

/**
 * Utility function to format seconds into MM:SS format.
 * @param {number} seconds
 * @returns {string}
 */
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const pad = (num) => String(num).padStart(2, '0');
  
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

/**
 * Renders the persistent audio player interface at the bottom of the screen.
 * Handles display of track info, playback controls, and scrubbing logic.
 */
export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    audioRef,
    currentTime,
    duration,
    seekTo,
  } = useAudioPlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  // Local state to hold the slider position while the user is actively dragging (scrubbing)
  const [seekValue, setSeekValue] = useState(0); 

  // Do not render the player if no track is loaded
  if (!currentTrack) {
    return null;
  }

  // --- Handlers for Seeking/Scrubbing ---
  
  // Fired when the user starts dragging the slider
  const handleSeekStart = (e) => {
    setIsSeeking(true);
    setSeekValue(Number(e.target.value));
  };

  // Fired continuously while dragging the slider
  const handleSeekChange = (e) => {
    setSeekValue(Number(e.target.value));
  };

  // Fired when the user releases the slider, updating the underlying audio element
  const handleSeekEnd = (e) => {
    const finalTime = Number(e.target.value);
    seekTo(finalTime);
    setIsSeeking(false);
  };

  // Determine the time to display: use local state while scrubbing, global state otherwise
  const displayTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  // Ensure max duration is a valid number for the slider's max attribute
  const maxDuration = isNaN(duration) || duration <= 0 ? 0 : duration;

  return (
    <div className={styles.audioPlayerContainer}>
      {/* The actual audio element reference is managed by the context provider */}
      {/* The audio element is rendered here only if the provider does not render it */}
      {/* If the provider already renders the audio element, this line can be removed or commented out. */}
      {/* <audio ref={audioRef} controls={false} /> */} 

      {/* Track Info */}
      <div className={styles.trackInfo}>
        <img 
            src={currentTrack.showImage || 'https://placehold.co/40x40/cccccc/333333?text=EP'} 
            alt="Show cover" 
            className={styles.trackImage}
        />
        <div className={styles.textDetails}>
            <p className={styles.title}>{currentTrack.title}</p>
            <p className={styles.show}>{currentTrack.showTitle}</p>
        </div>
      </div>

      {/* Controls and Seek Bar */}
      <div className={styles.playerControls}>
        
        {/* Play/Pause Button */}
        <button onClick={togglePlayPause} className={styles.playPauseButton} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Progress and Time */}
        <div className={styles.progressBarWrapper}>
            <span className={styles.timeDisplay}>{formatTime(displayTime)}</span>
            
            <input
                type="range"
                min="0"
                max={maxDuration} 
                value={displayTime}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchStart={handleSeekStart}
                onTouchEnd={handleSeekEnd}
                className={styles.progressBar}
                // Custom style applied for visualizing progress bar fill
                style={{ backgroundSize: `${progressPercent}% 100%` }}
                aria-label="Audio progress bar"
            />
            
            <span className={styles.timeDisplay}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}