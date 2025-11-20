import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const HISTORY_STORAGE_KEY = 'podcastListeningHistory';

const HistoryContext = createContext();

/**
 * Helper to load initial state from localStorage.
 * Returns an empty object if no history is found.
 */
const loadHistory = () => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    // Structure: { [episodeId]: { progress: number, finished: boolean, timestamp: number } }
    return storedHistory ? JSON.parse(storedHistory) : {};
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return {};
  }
};

/**
 * Provider component that tracks audio playback progress.
 * Automatically syncs listening history to localStorage.
 */
export const HistoryProvider = ({ children }) => {
  // Initialize state lazily to avoid reading localStorage on every render
  const [history, setHistory] = useState(loadHistory);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  /**
   * Updates the progress for a specific episode.
   * Marks episode as 'finished' if progress exceeds 98% of duration.
   * * @param {string} episodeId - The unique ID of the episode.
   * @param {number} progress - Current playback time in seconds.
   * @param {number} duration - Total duration of the episode in seconds.
   */
  const updateProgress = useCallback((episodeId, progress, duration) => {
    if (!episodeId) return;

    // Calculate completion status (98% threshold handles outliers/credits)
    const finished = duration > 0 && (progress / duration) >= 0.98;

    setHistory(prevHistory => ({
      ...prevHistory,
      [episodeId]: {
        progress,
        finished,
        timestamp: Date.now(), // Used for "Recently Played" sorting
      }
    }));
  }, []);

  /**
   * Resets the entire listening history.
   * Useful for testing or user settings.
   */
  const resetHistory = () => {
    setHistory({});
  };

  /**
   * Retrieves the progress object for a specific episode.
   * Returns a default object if the episode hasn't been played yet.
   * * @param {string} episodeId
   * @returns {{progress: number, finished: boolean, timestamp: number}}
   */
  const getProgress = (episodeId) => {
    return history[episodeId] || { progress: 0, finished: false, timestamp: 0 };
  };

  const value = { 
    history, 
    updateProgress, 
    getProgress, 
    resetHistory 
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

/**
 * Custom hook to access the listening history context.
 */
export const useHistory = () => useContext(HistoryContext);