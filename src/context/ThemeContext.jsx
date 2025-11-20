import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/**
 * Provider component that manages the application's theme.
 * Persists the theme preference in localStorage and updates the document body.
 */
export const ThemeProvider = ({ children }) => {
  // Lazy initialize state to read from localStorage only on the initial render
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    // Sync theme changes to localStorage
    localStorage.setItem("theme", theme);
    // Apply the 'data-theme' attribute to the body for global CSS styling
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the ThemeContext.
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export const useTheme = () => useContext(ThemeContext);