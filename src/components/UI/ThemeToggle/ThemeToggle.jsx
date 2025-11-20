// src/components/UI/ThemeToggle.jsx

import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

/**
 * A simple UI component to toggle between light and dark themes.
 * Displays a Sun or Moon icon based on the current theme state.
 *
 * @param {boolean} isDark - True if the current theme is dark.
 * @param {Function} toggleTheme - Callback function to switch the theme.
 */
const ThemeToggle = ({ isDark, toggleTheme }) => {
    
    const handleClick = (e) => {
        e.stopPropagation(); // Prevents the click event from triggering parent handlers
        if (typeof toggleTheme === 'function') {
            toggleTheme();
        }
    };

    return (
        <button 
            onClick={handleClick} 
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {/* The 'navIcon' class ensures consistent size and color inherited from the navigation bar styling */}
            {isDark ? (
                <FaSun className="navIcon" />
            ) : (
                <FaMoon className="navIcon" />
            )}
        </button>
    );
};

export default ThemeToggle;