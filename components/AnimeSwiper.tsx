"use client";
import { useSlidesPerView } from "@/app/hook";
import AnimeStarRating from "@/components/AnimeStarRating";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface AnimeSwiperProps {
  animeData: any[];
  onAnimeClick: (anime: any) => void;
  maxSlidesPerView?: number;
  ref?: any;
  isInfiniteScroll?: boolean;
}

const AnimeSwiper = ({
  animeData,
  onAnimeClick,
  maxSlidesPerView,
}: AnimeSwiperProps) => {
  const slidesPerView = useSlidesPerView();

  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination]}
      slidesPerView={
        slidesPerView >= 6 ? maxSlidesPerView || 6 : slidesPerView + 0.35
      }
      className="h-[100vh] max-h-[330px] w-full b"
    >
      {animeData &&
        animeData.map((anime: any, index: number) => (
          <SwiperSlide key={anime.mal_id + index} className="hover:scale-95">
            <button onClick={() => onAnimeClick(anime)}>
              <motion.div
                className="relative w-[240px] h-[300px] mx-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Image
                  src={anime.images.webp.large_image_url}
                  alt={anime.title}
                  fill
                  sizes="(max-width: 400px) 100vw, 400px"
                  quality={100}
                  className="rounded-lg"
                />
                <AnimeStarRating anime={anime} />
              </motion.div>
            </button>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default AnimeSwiper;
