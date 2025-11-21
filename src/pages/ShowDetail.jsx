import { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSinglePodcast } from "../api/fetchData.js";
import { PodcastContext } from "../context/PodcastContext.jsx";

import Loading from "../components/UI/Loading.jsx";
import Error from "../components/UI/Error.jsx";
import PodcastDetail from "../components/Podcasts/PodcastDetail.jsx";

/**
 * Smart container component for the individual Podcast Show Detail page.
 * Manages fetching of detailed show data and handles loading/error states.
 * Ensures initial metadata (like genres) is recovered from global state or location.
 */
export default function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { allPodcasts } = useContext(PodcastContext);

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine initial genres robustly from three potential sources (location state, global list, or null)
  const initialGenres = location.state?.genres || allPodcasts.find(p => p.id === id)?.genres || null;
  const [showGenres, setShowGenres] = useState(initialGenres);

  useEffect(() => {
    // If genres are still missing, try to find them when allPodcasts eventually loads
    if (!showGenres && allPodcasts.length > 0) {
      const show = allPodcasts.find(p => p.id === id);
      if (show && show.genres) {
        setShowGenres(show.genres);
      }
    }
    
    // Fetch the detailed podcast data for seasons and episodes
    fetchSinglePodcast(id, setPodcast, setError, setLoading);

  }, [id, allPodcasts, showGenres]);

  return (
    <>
      {loading && <Loading message="Loading podcast details..." />}
      {error && (
        <Error message={`Error occurred while fetching podcast: ${error}`} />
      )}
      {!loading && !error && podcast && (
        <PodcastDetail podcast={podcast} genres={showGenres} />
      )}
    </>
  );
}