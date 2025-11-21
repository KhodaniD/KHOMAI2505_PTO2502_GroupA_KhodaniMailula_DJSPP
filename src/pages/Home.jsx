import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './Home.module.css';

// Component Imports
import Carousel from '../components/Carousel/Carousel.jsx';
import PodcastGrid from '../components/Podcasts/PodcastGrid.jsx';
import GenreFilter from '../components/Filters/GenreFilter.jsx';
import SortSelect from '../components/Filters/SortSelect.jsx';
import Pagination from '../components/UI/Pagination.jsx';
import Loading from '../components/UI/Loading.jsx';
import Error from '../components/UI/Error.jsx';

import { PodcastContext } from '../context/PodcastContext.jsx';

const ITEMS_PER_PAGE = 12;

/**
 * The main Home page component.
 * Integrates global state (filtering, sorting) and manages local state (pagination).
 * Displays the carousel, filters, grid, and loading/error states.
 */
export default function Home() {
    const {
        podcasts, // Filtered and sorted list from context
        allPodcasts, // Unfiltered list for the carousel
        loading,
        error,
        searchTerm,
    } = useContext(PodcastContext);

    const [currentPage, setCurrentPage] = useState(1);
    
    // Reset to page 1 whenever the filtered/sorted list changes (e.g., when searching)
    useEffect(() => {
        setCurrentPage(1);
    }, [podcasts]);

    const totalItems = podcasts.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Memoized logic to paginate the filtered/sorted list
    const paginatedPodcasts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return podcasts.slice(startIndex, endIndex);
    }, [podcasts, currentPage]);

    // Handle loading and error states first
    if (loading) return <Loading message="Loading podcasts..." />;
    if (error) return <Error message={error} />;

    return (
       <div className={styles.homeContainer}>
            
            {/* Show the carousel only when no search term is active */}
            {!searchTerm && (
                <Carousel podcasts={allPodcasts} />
            )}
            
            {/* Filter and Sort Controls */}
            <div className={styles.controls}>
                <GenreFilter />
                <SortSelect />
            </div>

            {/* Dynamic Search Results Header */}
            {searchTerm && (
                <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: '0' }}>
                        {totalItems > 0 
                            ? `Search Results for "${searchTerm}"` 
                            : `No results for "${searchTerm}"`
                        }
                    </h2>
                </div>
            )}

            <section className={styles.gridSection}>
                <PodcastGrid podcasts={paginatedPodcasts} />
            </section>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
            
            {/* Secondary No Results Message for search */}
            {podcasts.length === 0 && searchTerm && (
                <p className={styles.noResults}>
                    Try adjusting your search terms or filters.
                </p>
            )}
        </div>
    );
}