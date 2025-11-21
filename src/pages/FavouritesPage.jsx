import React, { useState, useMemo } from 'react';
import { useFavourites } from '../context/FavouritesContext.jsx';
import styles from './FavouritesPage.module.css';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx';

/**
 * Utility function to format date string to human-readable format (e.g., Jul 7, 2025).
 * @param {string} dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
    if (!dateString) return 'Date Unknown';
    try {
        const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * Filters, sorts, and groups the list of favourited episodes.
 * Grouping is done by showTitle for display hierarchy.
 * @param {Object[]} favourites - The list of all favourited episodes.
 * @param {string} sortBy - Sorting key (e.g., 'Newest Added', 'Title A-Z').
 * @param {string} showFilter - Show title to filter by, or 'All Shows'.
 * @returns {Object<string, Object[]>} - Favourites grouped by show title.
 */
const groupAndSortFavourites = (favourites, sortBy, showFilter) => {
    // 1. Filter by show title
    const filtered = showFilter === 'All Shows'
        ? favourites
        : favourites.filter(fav => fav.showTitle === showFilter);

    // 2. Sort the filtered list
    filtered.sort((a, b) => {
        const dateA = new Date(a.addedDate);
        const dateB = new Date(b.addedDate);
        
        if (sortBy === 'Title A-Z') return a.title.localeCompare(b.title);
        if (sortBy === 'Title Z-A') return b.title.localeCompare(a.title);
        
        if (sortBy === 'Newest Added') return dateB.getTime() - dateA.getTime();
        if (sortBy === 'Oldest Added') return dateA.getTime() - dateB.getTime();
        
        return 0;
    });

    // 3. Group by Show Title
    return filtered.reduce((acc, fav) => {
        if (!acc[fav.showTitle]) {
            acc[fav.showTitle] = [];
        }
        acc[fav.showTitle].push(fav);
        return acc;
    }, {});
};

/**
 * The Favourites Page component.
 * Displays user's saved episodes with options for sorting, filtering, and direct playback.
 */
export default function FavouritesPage() {
    const { favourites, removeFavourite } = useFavourites();
    const { playTrack } = useAudioPlayer();

    const [sortBy, setSortBy] = useState('Newest Added');
    const [showFilter, setShowFilter] = useState('All Shows');

    // Memoized list of unique show titles for the filter dropdown
    const uniqueShowTitles = useMemo(() => {
        const titles = [...new Set(favourites.map(fav => fav.showTitle).filter(title => title))];
        return titles.sort();
    }, [favourites]);

    // Memoized processing of the favourites list (filtering, sorting, grouping)
    const groupedFavourites = useMemo(() =>
        groupAndSortFavourites(favourites, sortBy, showFilter),
        [favourites, sortBy, showFilter]
    );

    const handlePlay = (episode) => {
        const episodeId = episode.originalEpisodeId || episode.id;
        const audioUrl = episode.file;

        if (!episodeId || !audioUrl) {
            console.error("Cannot play track: Missing Episode ID or Audio URL.");
            return;
        }
        
        // Prepare track data for the global audio player
        playTrack({
            id: episodeId,
            title: episode.title,
            image: episode.image || episode.showImage,
            artist: episode.showTitle,
            file: audioUrl,
        });
    };
    
    // Remove the episode using the unique ID required by the context
    const handleRemove = (fav) => {
        const idToRemove = fav.originalEpisodeId;
        
        if (idToRemove) {
            removeFavourite(idToRemove);
        } else {
            console.error("Error: Favourite object is missing unique ID and cannot be removed.");
        }
    };

    if (!favourites || favourites.length === 0) {
        return (
            <main className={styles.main}>
                <h1 className={styles.title}>Favourite Episodes</h1>
                <p className={styles.description}>Your saved episodes from all shows</p>
                <div className={styles.emptyMessage}>
                    You haven't added any favourites yet. Click the heart icon on any episode to save it here!
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Favourite Episodes</h1>
            <p className={styles.description}>Your saved episodes from all shows</p>

            {/* Controls Section */}
            <div className={styles.controls}>
                <label htmlFor="sortBy" className={styles.label}>Sort by:</label>
                <select 
                    id="sortBy" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.select}
                    aria-label="Sort favourites by"
                >
                    <option value="Newest Added">Newest Added</option>
                    <option value="Oldest Added">Oldest Added</option>
                    <option value="Title A-Z">Title (A-Z)</option>
                    <option value="Title Z-A">Title (Z-A)</option>
                </select>

                <label htmlFor="showFilter" className={styles.label}>Show:</label>
                <select 
                    id="showFilter" 
                    value={showFilter} 
                    onChange={(e) => setShowFilter(e.target.value)}
                    className={styles.select}
                    aria-label="Filter favourites by show"
                >
                    <option value="All Shows">All Shows</option>
                    {uniqueShowTitles.map(title => (
                        <option key={title} value={title}>{title}</option>
                    ))}
                </select>
            </div>
            
            {/* Episode List (Grouped) */}
            <div className={styles.episodeContainer}>
                {Object.keys(groupedFavourites).map(showTitle => (
                    <div key={showTitle} className={styles.showGroup}>
                        {/* Group Header */}
                        <h2 className={styles.showTitle}>
                            {showTitle} 
                            <span className={styles.episodeCount}>
                                ({groupedFavourites[showTitle].length} episode{groupedFavourites[showTitle].length !== 1 ? 's' : ''})
                            </span>
                        </h2>

                        {/* Individual Episode Cards */}
                        {groupedFavourites[showTitle].map(fav => (
                            <div key={fav.id} className={styles.episodeCard}>
                                <img 
                                    src={fav.image || fav.showImage || 'https://placehold.co/60x60/cccccc/333333?text=EP'} 
                                    alt="Episode Cover" 
                                    className={styles.episodeCover}
                                />
                                <div className={styles.episodeContent}>
                                    <h3 className={styles.episodeTitle}>{fav.title}</h3>
                                    <p className={styles.episodeMeta}>
                                        {fav.seasonTitle ? `${fav.seasonTitle} • ` : ''} 
                                        {`Episode ${fav.episodeNumber || fav.episode || 'N/A'}`}
                                    </p>
                                    <p className={styles.episodeDescription}>
                                        {fav.description || 'No description available for this episode.'}
                                    </p>
                                    <p className={styles.dateAdded}>
                                        Added on {formatDate(fav.addedDate)}
                                    </p>
                                </div>

                                <div className={styles.episodeActions}>
                                    {/* Remove Favourite Button */}
                                    <button 
                                        onClick={() => handleRemove(fav)}
                                        className={`${styles.actionButton} ${styles.favourited}`}
                                        aria-label="Remove from favourites"
                                        title="Remove from favourites"
                                    >
                                        <FaHeart />
                                    </button>
                                    {/* Play Button */}
                                    <button 
                                        onClick={() => handlePlay(fav)}
                                        className={styles.actionButton}
                                        aria-label="Play Episode"
                                        title="Play Episode"
                                    >
                                        <FaPlay />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
}