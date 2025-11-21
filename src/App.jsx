import React from 'react';
import { Routes, Route } from "react-router-dom";

import Header from "./components/UI/Header.jsx";
import Home from "./pages/Home.jsx";
import ShowDetail from "./pages/ShowDetail.jsx";
import FavouritesPage from "./pages/FavouritesPage.jsx";

// Context Providers (imported as default or named exports based on context definitions)
import PodcastProvider from "./context/PodcastContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import FavouritesProvider from "./context/FavouritesContext.jsx";
import { AudioPlayerProvider } from "./context/AudioPlayerContext.jsx";
import { HistoryProvider } from "./context/HistoryContext.jsx";

import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx";
import "./global.css";

/**
 * Root component of the Podcast Explorer app.
 * Defines the entire application architecture: Context stack, routing, and persistent UI elements.
 */
export default function App() {
  return (
    // Stack of context providers, ensuring theme is available globally
    <ThemeProvider>
        <FavouritesProvider>
            <HistoryProvider>
                <AudioPlayerProvider>
                    <PodcastProvider>
                        
                        {/* Header is inside the providers to access search and theme contexts */}
                        <Header />
                        
                        <main>
                            <Routes>
                                {/* Main Application Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/show/:id" element={<ShowDetail />} />
                                <Route path="/favourites" element={<FavouritesPage />} />
                            </Routes>
                        </main>
                        
                        {/* Persistent Audio Player is displayed at the bottom of all views */}
                        <AudioPlayer />
                    </PodcastProvider>
                </AudioPlayerProvider>
            </HistoryProvider>
        </FavouritesProvider>
    </ThemeProvider>
  );
}