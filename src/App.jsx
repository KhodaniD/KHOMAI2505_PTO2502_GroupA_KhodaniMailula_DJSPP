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
         
          {/* Favourites Route (Including Case Insensitivity Fix) */}
          <Route path="/favourites" element={<FavouritesPage />} caseSensitive={false} />
          
          {/* FIX: Add Catch-All route (path="*") to handle client-side 404s.
             This renders a friendly error page instead of letting Vercel display its generic 404. */}
          <Route path="*" element={
            <div className="container mx-auto p-10 text-center text-xl">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p>The requested page could not be found. Please check the URL.</p>
              <a href="/" className="text-blue-500 hover:underline mt-4 inline-block">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      
      {/* Persistent Audio Player */}
      <AudioPlayer />
    </>
  );
}