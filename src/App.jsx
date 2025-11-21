import React from 'react';
import { Routes, Route } from "react-router-dom";

import Header from "./components/UI/Header.jsx";
import Home from "./pages/Home.jsx";
import ShowDetail from "./pages/ShowDetail.jsx";
import FavouritesPage from "./pages/FavouritesPage.jsx";

import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx";
import "./global.css";

/**
 * Root component of the application.
 * Defines the main page layout, navigation, and persistent UI elements (Header, AudioPlayer).
 * NOTE: All Context Providers are now stacked in the root entry file (main.jsx).
 */
export default function App() {
  return (
    <>
      <Header />
      
      <main>
        <Routes>
          {/* Main Application Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </main>
      
      {/* Persistent Audio Player */}
      <AudioPlayer />
    </>
  );
}