import React from 'react';
import styles from './Pagination.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Renders pagination controls for the main podcast grid.
 * @param {number} currentPage - The currently active page number.
 * @param {number} totalPages - The total number of pages available.
 * @param {function} onPageChange - Callback function when a new page is selected.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    /**
     * Generates an array of page numbers to display (max 5 buttons, centered).
     */
    const getPageNumbers = () => {
        const pages = [];
        // Determine start and end pages to show up to 5 buttons max
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Adjust start page if we are near the end to maintain 5 buttons
        if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={styles.pageButton}
                aria-label="Previous Page"
            >
                <FaChevronLeft />
            </button>

            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
                aria-label="Next Page"
            >
                <FaChevronRight />
            </button>
        </div>
    );
}