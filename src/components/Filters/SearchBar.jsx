import React, { useContext } from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';
import { PodcastContext } from '../../context/PodcastContext.jsx';

/**
 * Renders a standalone search input field connected to the global search state.
 * Allows users to filter the main podcast list by updating searchTerm in PodcastContext.
 */
export default function SearchBar() {
  // Destructure global search state and setter
  const { searchTerm, setSearchTerm } = useContext(PodcastContext);

  const handleChange = (e) => {
    // Updates the global state, triggering a re-filter of the podcast list
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.searchWrapper}>
      <FaSearch className={styles.searchIcon} />
      
      <input
        type="search"
        placeholder="Search podcasts..."
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
        id="global-search"
        name="search"
      />
    </div>
  );
}