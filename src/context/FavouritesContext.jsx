import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const FavouritesContext = createContext();
const LOCAL_STORAGE_KEY = 'podcastExplorerFavourites';

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

/**
 * Provider component that manages the user's favourite episodes.
 * Persists data to localStorage to maintain state across browser sessions.
 */
const FavouritesProvider = ({ children }) => {
  
  // State for all raw favourited episodes (persisted to localStorage)
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing favourites from localStorage:", error);
      return [];
    }
  });
  
  // State for filtering and sorting on the Favourites page
  const [sortBy, setSortBy] = useState('addedDate_desc'); // Default: Newest first

  // Effect: Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favourites));
    } catch (error) {
      console.error("Error saving favourites to localStorage:", error);
    }
  }, [favourites]);

  // --- Core Utility Functions ---

  /**
   * Sorts the array of favourited episodes based on the selected criteria.
   * Assumes all fields exist (title, addedDate).
   */
  const sortFavourites = (items, sortKey) => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      if (sortKey === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortKey === 'title_desc') {
        return b.title.localeCompare(a.title);
      }
      
      const dateA = new Date(a.addedDate);
      const dateB = new Date(b.addedDate);

      if (sortKey === 'addedDate_asc') {
        return dateA - dateB;
      }
      return dateB - dateA; // Default: addedDate_desc
    });
    return sorted;
  };

  /**
   * Groups favourites by showTitle and applies the current sorting.
   * This is the final data structure used by FavouritesPage.
   */
  const groupedAndSortedFavourites = useMemo(() => {
    
    // 1. Group the raw favourites by their parent showTitle
    const grouped = favourites.reduce((acc, current) => {
        const showId = current.showId || 'unknown-show';
        if (!acc[showId]) {
            acc[showId] = {
                showTitle: current.showTitle || 'Unknown Show',
                episodes: []
            };
        }
        acc[showId].episodes.push(current);
        return acc;
    }, {});

    // 2. Sort the episodes within each group
    for (const key in grouped) {
        grouped[key].episodes = sortFavourites(grouped[key].episodes, sortBy);
    }

    // Convert the object map into a final array structure
    return Object.values(grouped);
  }, [favourites, sortBy]);


  /**
   * Checks if an episode is already in the favourites list.
   */
  const isFavourited = (episodeOriginalId) => {
    return favourites.some((item) => item.originalEpisodeId === episodeOriginalId);
  };

  /**
   * Adds an episode to favourites with relevant metadata (Show/Season title, addedDate).
   */
  const addFavourite = (episodeData, showTitle, seasonTitle, showId) => {
    const originalEpisodeId = episodeData.id;
      
    if (isFavourited(originalEpisodeId)) {
        console.warn(`Episode ${originalEpisodeId} is already in favourites. (Ignored add)`);
        return;
    }

    const newFavourite = {
      ...episodeData,
      showTitle,
      seasonTitle,
      showId, // Added showId for consistent grouping/lookup
      addedDate: new Date().toISOString(), // Timestamp for sorting
      originalEpisodeId, 
    };
    
    setFavourites(prev => [...prev, newFavourite]);
  };

  /**
   * Removes an episode from the favourites list by its original ID.
   */
  const removeFavourite = (episodeOriginalId) => {
    setFavourites(prev => prev.filter(item => item.originalEpisodeId !== episodeOriginalId));
  };

  // --- Context Value ---
  const contextValue = { 
      // Raw data (useful for checking if an icon should be filled)
      favourites, 
      
      // Grouped and Sorted data (used by the Favourites Page)
      groupedFavourites: groupedAndSortedFavourites, 
      
      // Actions
      addFavourite, 
      removeFavourite, 
      isFavourited,
      
      // Sorting State & Setters
      sortBy,
      setSortBy,
  };

  return (
    <FavouritesContext.Provider value={contextValue}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesProvider;