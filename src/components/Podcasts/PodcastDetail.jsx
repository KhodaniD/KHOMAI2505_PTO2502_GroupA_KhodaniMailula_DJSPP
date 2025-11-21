import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags.jsx";

// Contexts & Icons
import { useFavourites } from "../../context/FavouritesContext.jsx";
import { useAudioPlayer } from "../../context/AudioPlayerContext.jsx";
import { FaHeart, FaRegHeart, FaPlay } from "react-icons/fa";

/**
 * Renders the detail view for a single podcast show, including season selection and episode list.
 * Integrates playback controls and favorite toggling via global contexts.
 * * @param {Object} props
 * @param {Object} props.podcast - Full podcast data object (image, title, seasons).
 * @param {Object[]} props.genres - List of available genre objects.
 */
export default function PodcastDetail({ podcast, genres }) {
  if (!podcast || !podcast.seasons || podcast.seasons.length === 0) {
    return null;
  }

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();

  // Access all necessary functions and state from contexts
  const { favourites, addFavourite, removeFavourite, isFavourited } = useFavourites();
  const { playTrack } = useAudioPlayer();

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Go Back">
        ← Back
      </button>

      {/* Header (Cover, Title, Description, Meta) */}
      <div className={styles.header}>
        <img src={podcast.image} alt="Podcast Cover" className={styles.cover} />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <div className={styles.genreTags}>
            <GenreTags genres={podcast.genres} />
          </div>
          
          {/* Description with Expand/Collapse Toggle */}
          <p className={styles.description} onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
              {isDescriptionExpanded 
                ? podcast.description 
                : `${podcast.description.substring(0, 150)}...`}
            <span className={styles.expandToggle}>
              {isDescriptionExpanded ? ' Show Less' : ' Show More'}
            </span>
          </p>
          
          <div className={styles.metaInfo}>
            <p><strong>Seasons:</strong> {podcast.seasons.length}</p>
            <p><strong>Updated:</strong> {formatDate(podcast.updated)}</p>
          </div>
        </div>
      </div>
      
      {/* Season Selection Dropdown */}
      <div className={styles.seasonSelectWrapper}>
        <select
          value={selectedSeasonIndex}
          onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
          className={styles.select}
          aria-label="Select Season"
        >
          {podcast.seasons.map((s, index) => (
            <option key={index} value={index}>
              {s.title} ({s.episodes.length} Episodes)
            </option>
          ))}
        </select>
      </div>

      {/* EPISODE LIST */}
      <div className={styles.episodeList}>
        <h2 className={styles.seasonTitle}>{season.title}</h2>
        
        {season.episodes && season.episodes.map((ep, index) => {
          // Generate a unique ID for robust tracking across history/favourites
          const episodeId = ep.id || `${podcast.id}-${season.title}-${ep.title}-${index}`;
          
          // Create a unified data package for context consumption (Player/Favourites)
          const episodeData = {
            ...ep,
            id: episodeId,
            episodeNumber: ep.episode || index + 1,
            file: ep.file,
            showImage: podcast.image,
            seasonTitle: season.title,
            showTitle: podcast.title,
          };

          const isFav = isFavourited(episodeId);

          const handleFavouriteToggle = (e) => {
            e.stopPropagation();
            if (isFav) {
              removeFavourite(episodeId);
            } else {
              addFavourite(episodeData, podcast.title, season.title);
            }
          };

          const handlePlay = (e) => {
            e.stopPropagation();
            playTrack(episodeData); // Pass the robust data package to the player
          };

          return (
            <div key={episodeId} className={styles.episodeCard}>
              <div className={styles.episodeInfo}>
                <p className={styles.episodeTitle}>
                  Episode {episodeData.episodeNumber}: {ep.title}
                </p>
                <p className={styles.episodeDesc}>{ep.description}</p>
              </div>
              
              <div className={styles.episodeActions}>
                <button
                  onClick={handleFavouriteToggle}
                  className={`${styles.actionButton} ${
                    isFav ? styles.favourited : ""
                  }`}
                  aria-label={isFav ? "Unfavourite" : "Favourite"}
                  title={isFav ? "Unfavourite" : "Favourite"}
                >
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                  onClick={handlePlay}
                  className={styles.actionButton}
                  aria-label="Play Episode"
                  title="Play Episode"
                >
                  <FaPlay />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}