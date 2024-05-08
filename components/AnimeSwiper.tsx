"use client";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import AnimeStarRating from "@/components/AnimeStarRating";
import { useSlidesPerView } from "@/app/hook";
import classNames from "classnames";
import { motion } from "framer-motion";

interface AnimeSwiperProps {
  animeData: any[];
  onAnimeClick: (anime: any) => void;
  loadSlide?: boolean;
  onLoadMore?: () => void;
  fetchingAnime?: boolean;
  maxSlidesPerView?: number;
}

const AnimeSwiper = ({
  animeData,
  onAnimeClick,
  loadSlide,
  onLoadMore,
  fetchingAnime,
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
      {animeData.map((anime: any, index: number) => (
        <SwiperSlide key={anime.mal_id + index} className="hover:scale-95">
          <button onClick={() => onAnimeClick(anime)}>
            <motion.div
              className="relative w-[240px] h-[300px] mx-auto"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
      {loadSlide && (
        <SwiperSlide>
          <button
            disabled={fetchingAnime}
            className={classNames(
              "relative w-[240px] h-[300px] bg-slate-800 rounded-lg flex items-center justify-center hover:scale-95",
              {
                "opacity-70 cursor-not-allowed": fetchingAnime,
              }
            )}
            onClick={() => {
              if (onLoadMore) {
                onLoadMore();
              }
            }}
          >
            {fetchingAnime ? "Fetching Anime..." : "Click me to load more..."}
          </button>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default AnimeSwiper;
