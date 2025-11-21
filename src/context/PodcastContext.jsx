import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { fetchPodcasts } from '../api/fetchData';

// Initialize Context
// FIX: The Context object MUST be exported as a named export
//      so that the custom hook (usePodcast) and other files can access it.
export const PodcastContext = createContext(); // <-- FIX IS HERE

/**
 * Custom hook to access Podcast Context data.
 * @returns {Object} Contains podcasts, loading state, error, and filter setters.
 */
export const usePodcast = () => useContext(PodcastContext); // This now correctly accesses the exported Context

const GENRE_MAP = {
  1: "Personal Growth", 2: "Investigative Journalism", 3: "History",
  4: "Comedy", 5: "Entertainment", 6: "Business", 7: "Fiction",
  8: "News", 9: "Kids and Family"
};

/**
 * Normalizes raw API data to ensure strictly typed fields.
 * Prevents runtime errors by providing fallback strings for missing titles/descriptions.
 */
const formatPodcastData = (podcasts) => {
  return podcasts.map(podcast => ({
    id: String(podcast.id),
    title: podcast.title || '',
    description: podcast.description || '',
    image: podcast.image,
    seasons: podcast.seasons,
    // Note: The structure of genres in the API can be messy (objects or IDs),
    // this handles normalization to an array of Numbers.
    genres: Array.isArray(podcast.genres) ? podcast.genres.map(g => Number(g.id || g)) : [],
    updated: podcast.updated,
  }));
};

/**
 * Main Provider component responsible for fetching data and managing global state.
 */
export const PodcastProvider = ({ children }) => {
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and Sort State
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState('updated_desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    // Note: This assumes fetchPodcasts is structured to handle all three callbacks (success, error, loading)
    fetchPodcasts(
      (data) => setAllPodcasts(formatPodcastData(data)),
      setError,
      setLoading
    );
  }, []);

  // Extract unique genres available in the fetched data
  const allGenres = useMemo(() => {
    const genreMap = new Map();
    allPodcasts.forEach(podcast => {
      podcast.genres.forEach(id => {
        if (!genreMap.has(id)) {
          const title = GENRE_MAP[id] || `Genre ${id}`;
          genreMap.set(id, { id: id, title: title });
        }
      });
    });
    // Add 'All Genres' option
    const genreArray = Array.from(genreMap.values()).map(g => ({ id: g.id, title: g.title }));
    return [{ id: 'all', title: 'All Genres' }, ...genreArray];
  }, [allPodcasts]);

  // Handle Filtering (Search/Genre) and Sorting
  const filteredAndSortedPodcasts = useMemo(() => {
    let filtered = [...allPodcasts];

    // 1. Search Filter (Case insensitive check on Title and Description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(podcast =>
        podcast.title.toLowerCase().includes(lowerCaseSearch) ||
        podcast.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. Genre Filter
    if (genre !== 'all') {
      const genreIdToFilter = Number(genre);
      filtered = filtered.filter(podcast =>
        podcast.genres.includes(genreIdToFilter)
      );
    }

    // 3. Sorting Logic
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === 'title_asc') return a.title.localeCompare(b.title);
      if (sort === 'title_desc') return b.title.localeCompare(a.title); 

      const dateA = new Date(a.updated);
      const dateB = new Date(b.updated);

      if (sort === 'updated_asc') return dateA - dateB;
      return dateB - dateA; // Default: updated_desc
    });

    return sorted;
  }, [allPodcasts, genre, sort, searchTerm]);

  const value = {
    // Export raw data for features like the carousel
    allPodcasts,
    // Export filtered/sorted data for the main grid
    podcasts: filteredAndSortedPodcasts,
    loading,
    error,
    // Filter and Sort State/Setters
    genre,
    setGenre,
    sort,
    setSort,
    genres: allGenres, // Includes 'All Genres' for dropdown
    searchTerm,
    setSearchTerm,
    // Helper function to get genre title
    getGenreTitle: (id) => GENRE_MAP[id] || `Genre ${id}` 
  };

  return (
    <PodcastContext.Provider value={value}>
      {children}
    </PodcastContext.Provider>
  );
};

export default PodcastProvider;