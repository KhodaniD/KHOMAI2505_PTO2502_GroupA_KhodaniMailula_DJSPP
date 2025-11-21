import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PodcastCard from "../Podcasts/PodcastCard.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Base Swiper CSS imports
import "swiper/css";
import "swiper/css/navigation";
import * as styles from "./Carousel.css"; // Imports CSS classes via namespace import

/**
 * Renders a horizontally scrolling carousel of recommended podcasts.
 * The recommendation logic shuffles the input list.
 * @param {Object[]} podcasts - Array of podcast objects.
 */
function Carousel({ podcasts }) {
  const navigate = useNavigate();
  
  // Memoized logic to shuffle and limit the list of recommended shows to 15
  const recommendedShows = useMemo(() => {
    return [...podcasts].sort(() => 0.5 - Math.random()).slice(0, 15);
  }, [podcasts]);

  return (
    <section className={styles['carousel-container']}>
      <div className={styles['carousel-header']}>
        <h2 className={styles['carousel-title']}>Recommended Shows</h2>
        <div className={styles['carousel-nav']}>
          <button 
            className={`${styles['carousel-nav-button']} custom-prev`} 
            aria-label="Previous Slide"
          >
            <FaChevronLeft />
          </button>
          <button 
            className={`${styles['carousel-nav-button']} custom-next`} 
            aria-label="Next Slide"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
        
        // Define slide count based on viewport width
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1200: { slidesPerView: 6, spaceBetween: 20 },
        }}
      >
        {recommendedShows.map((podcast) => (
          <SwiperSlide key={podcast.id} className={styles['carousel-slide']}>
            <PodcastCard 
              podcast={podcast} 
              // State passing ensures genre tags are available on detail page immediately
              onClick={() => navigate(`/show/${podcast.id}`, { state: { genres: podcast.genres } })}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default memo(Carousel);