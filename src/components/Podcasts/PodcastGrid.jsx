import React from 'react';
import styles from './PodcastGrid.module.css';
import PodcastCard from './PodcastCard.jsx';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a responsive grid container for displaying PodcastCard components.
 * Handles the "no results found" state if the input array is empty.
 *
 * @param {Object} props
 * @param {Object[]} props.podcasts - An array of filtered and paginated podcast objects.
 */
export default function PodcastGrid({ podcasts }) {
    const navigate = useNavigate();
    
    // Check for empty or null data before rendering the grid
    if (!podcasts || podcasts.length === 0) {
        return <div className={styles.noResults}>No podcasts found matching your criteria.</div>;
    }

    return (
        <div className={styles.grid}>
            {podcasts.map(podcast => (
                <PodcastCard
                    key={podcast.id}
                    podcast={podcast}
                    onClick={() => navigate(`/show/${podcast.id}`, { state: { genres: podcast.genres } })}
                />
            ))}
        </div>
    );
}