import React from 'react';
import styles from './GenreTags.module.css';
import { genres as allGenres } from '../../data.js';

/**
 * Renders small tags for the genres associated with a podcast.
 * Maps genre IDs to titles and displays a maximum of two tags for visual cleanliness.
 *
 * @param {Object} props
 * @param {number[]} props.genres - An array of genre IDs (e.g., [1, 5]).
 * @returns {JSX.Element | null} The rendered list of tags or null if no genres exist.
 */
export default function GenreTags({ genres }) {
  // Guard clause: Return null if the genres array is not defined or is empty.
  if (!Array.isArray(genres) || genres.length === 0) {
    return null;
  }

  // Map genre IDs to their corresponding titles from the imported data.
  const genreTitles = genres.map(id => {
    const genreObj = allGenres.find(g => g.id === id);
    return genreObj ? genreObj.title : null;
  }).filter(title => title !== null); // Filter out any unknown IDs

  // Truncate the list to display only the first two tags.
  const displayTags = genreTitles.slice(0, 2);

  if (displayTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {displayTags.map(title => (
        <span key={title} className={styles.tag}>
          {title}
        </span>
      ))}
    </div>
  );
}