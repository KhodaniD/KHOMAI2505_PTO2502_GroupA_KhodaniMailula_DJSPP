import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastCard.module.css";
import GenreTags from "../UI/GenreTags.jsx";

/**
 * Renders a clickable card component displaying basic information about a single podcast show.
 * Navigates to the full show details page on click.
 *
 * @param {Object} props
 * @param {Object} props.podcast - The podcast object data (title, image, seasons, updated, genres).
 */
export default function PodcastCard({ podcast }) {
  const navigate = useNavigate();

  const handleNavigate = (preview) => {
    // Navigates to the show detail page, passing genres via state for potential use.
    navigate(`/show/${preview.id}`, { state: { genres: preview.genres } });
  };

  return (
    <div className={styles.card} onClick={() => handleNavigate(podcast)}>
      <img src={podcast.image} alt={podcast.title} />

      <div className={styles.textContainer}>
        <h3>{podcast.title}</h3>
        <GenreTags genres={podcast.genres} />
        
        <div className={styles.detailsBlock}>
          <p className={styles.seasons}>{podcast.seasons} seasons</p>
          <p className={styles.updatedText}>
            Updated {formatDate(podcast.updated)}
          </p>
        </div>
      </div>
    </div>
  );
}