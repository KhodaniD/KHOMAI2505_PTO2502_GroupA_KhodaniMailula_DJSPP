import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PodcastCard from "../Podcasts/PodcastCard.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./Carousel.css";

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
    <section className="carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">Recommended Shows</h2>
        <div className="carousel-nav">
          <button className="carousel-nav-button custom-prev" aria-label="Previous Slide">
            <FaChevronLeft />
          </button>
          <button className="carousel-nav-button custom-next" aria-label="Next Slide">
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
          <SwiperSlide key={podcast.id} className="carousel-slide">
            <PodcastCard 
              podcast={podcast} 
              onClick={() => navigate(`/show/${podcast.id}`, { state: { genres: podcast.genres } })}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default memo(Carousel);