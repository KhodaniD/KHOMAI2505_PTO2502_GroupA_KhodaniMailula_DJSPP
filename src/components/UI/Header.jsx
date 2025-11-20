import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUserCircle, FaSearch, FaPodcast, FaSpa } from 'react-icons/fa';
import styles from './Header.module.css';

import ThemeToggle from "./ThemeToggle.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { PodcastContext } from "../../context/PodcastContext.jsx";

/**
 * Main application header component.
 * Provides branding, global search input, navigation links, and theme toggling.
 */
const Header = () => {
  // Access theme state and toggle function
  const { isDark, toggleTheme } = useTheme();
  
  // Access global search state and setter for input binding
  const { searchTerm, setSearchTerm } = useContext(PodcastContext);

  return (
    <header className={styles.header}>
      {/* Branding Area */}
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logoLink}>
          <FaPodcast className={styles.brandIcon} />
          <FaSpa className={styles.flowerIcon} />
          <h1 className={styles.appTitle}>Bloom Anyway</h1>
        </Link>
      </div>

      {/* Navigation & Search Area */}
      <nav className={styles.navIcons}>
        
        {/* Search Bar integrated with global context state */}
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.divider}></div>

        {/* Favorites Link */}
        <Link to="/favourites" className={styles.navLink}>
          <FaHeart className={styles.navIcon} title="Favorites" />
        </Link>

        {/* Theme Toggle Component */}
        <div className={styles.navItem}>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>

        {/* Profile Icon */}
        <div className={styles.navItem}>
          <FaUserCircle className={styles.navIcon} title="Profile" />
        </div>
      </nav>
    </header>
  );
};

export default Header;