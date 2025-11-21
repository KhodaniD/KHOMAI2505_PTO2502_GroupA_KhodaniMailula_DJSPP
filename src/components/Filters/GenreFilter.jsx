// src/components/Filters/GenreFilter.jsx

import React, { useContext } from "react";
import { FaAngleDown } from "react-icons/fa";
import styles from "./GenreFilter.module.css";
import { PodcastContext } from "../../context/PodcastContext.jsx";

/**
 * Renders a dropdown select element for filtering podcasts by genre.
 * Reads available genres and current filter state from PodcastContext.
 */
export default function GenreFilter() {
  // Destructure genres list, current filter, and setter from global context
  const { genres, genre, setGenre } = useContext(PodcastContext);

  const handleChange = (e) => {
    // Pass the selected value (which is the genre ID as a string) directly to the context setter.
    setGenre(e.target.value);
  };

  return (
    <div className={styles.genreFilter}>
      <select
        value={genre}
        onChange={handleChange}
        className={styles.genreSelect}
        id="genreFilter"
      >
        {/* The default option resets the filter */}
        <option value="all">All Genres</option>
        
        {genres.map((g) => (
          <option
            key={g.id}
            // Value is the genre ID (as a string) used for filtering
            value={g.id}
          >
            {/* Display text is the human-readable genre title */}
            {g.title}
          </option>
        ))}
      </select>
      
      {/* Custom arrow icon for styling the dropdown, positioned via CSS */}
      <FaAngleDown className={styles.arrowIcon} />
    </div>
  );
}