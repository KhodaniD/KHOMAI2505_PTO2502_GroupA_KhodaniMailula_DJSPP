import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import PodcastProvider from './context/PodcastContext.jsx';
import FavouritesProvider from './context/FavouritesContext.jsx';
import { AudioPlayerProvider } from './context/AudioPlayerContext.jsx';
import { HistoryProvider } from './context/HistoryContext.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* BrowserRouter wraps the entire application to enable client-side routing */}
      <BrowserRouter>
        {/* Stack all Context Providers to ensure state is available globally */}
        <ThemeProvider>
          <FavouritesProvider>
            <HistoryProvider>
              <AudioPlayerProvider>
                <PodcastProvider>
                  <App />
                </PodcastProvider>
              </AudioPlayerProvider>
            </HistoryProvider>
          </FavouritesProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}