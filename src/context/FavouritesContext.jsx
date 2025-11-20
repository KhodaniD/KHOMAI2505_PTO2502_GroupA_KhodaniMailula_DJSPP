import React, { createContext, useContext, useState, useEffect } from "react";

const FavouritesContext = createContext();
const LOCAL_STORAGE_KEY = 'podcastExplorerFavourites';

/**
 * Provider component that manages the user's favourite episodes.
 * Persists data to localStorage to maintain state across browser sessions.
 */
const FavouritesProvider = ({ children }) => {
  // Lazy initialization: Read from localStorage only on the initial mount
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing favourites from localStorage:", error);
      return [];
    }
  });

  // Effect: Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favourites));
    } catch (error) {
      console.error("Error saving favourites to localStorage:", error);
    }
  }, [favourites]);

  /**
   * Checks if an episode is already in the favourites list.
   * @param {string|number} episodeOriginalId - The unique ID of the episode.
   * @returns {boolean}
   */
  const isFavourited = (episodeOriginalId) => {
    return favourites.some((item) => item.originalEpisodeId === episodeOriginalId);
  };

  /**
   * Adds an episode to favourites with relevant metadata (Show/Season title).
   * Prevents duplicates if the episode is already saved.
   */
  const addFavourite = (episodeData, showTitle, seasonTitle) => {
    const originalEpisodeId = episodeData.id;
      
    if (isFavourited(originalEpisodeId)) {
        console.warn(`Episode ${originalEpisodeId} is already in favourites.`);
        return;
    }

    const newFavourite = {
      ...episodeData,
      showTitle,
      seasonTitle,
      addedDate: new Date().toISOString(), 
      originalEpisodeId, // Key used for referencing deletions
    };
    
    setFavourites(prev => [...prev, newFavourite]);
  };

  /**
   * Removes an episode from the favourites list by its original ID.
   */
  const removeFavourite = (episodeOriginalId) => {
    setFavourites(prev => prev.filter(item => item.originalEpisodeId !== episodeOriginalId));
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourited }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

/**
 * Custom hook to access the FavouritesContext.
 * Throws an error if used outside of the FavouritesProvider.
 */
export const useFavourites = () => {
    const context = useContext(FavouritesContext);
    if (context === undefined) {
        throw new Error('useFavourites must be used within a FavouritesProvider');
    }
    return context;
};

export default FavouritesProvider;