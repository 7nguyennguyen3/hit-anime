"use client";
import AnimeStarRating from "@/components/AnimeStarRating";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Anime } from "./search/page";
import ShowAnimeDetail from "./search/ShowAnimeDetail";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSlidesPerView } from "./hook";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const animeIds = [52588, 58080, 53446, 51009, 18689];

const Home = () => {
  const [anime, setAnime] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);
  const slidesPerView = useSlidesPerView();

  useEffect(() => {
    const fetchAnimeByIds = async () => {
      try {
        const animePromises = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}`)
        );
        const responses = await Promise.all(animePromises);
        const animeData = responses.map((res) => res.data.data);
        setAnime(animeData);
        console.log(animeData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnimeByIds();
  }, []);

  return (
    <div className="p-5 max-w-[1400px] mx-auto">
      <div
        className="w-full max-w-[1000px] mx-auto bg-slate-800 rounded-lg p-5
      flex flex-col gap-5"
      >
        <Image
          src="/logo-no-background.svg"
          alt="Logo Image"
          width={200}
          height={100}
        />
        <text className="text-lg font-medium">
          Welcome to Hit Anime! Your friendly anime app using the free and
          almighty Jikan API(MyAnimeList) for searching your next anime. Our
          features are optimized for you to{" "}
          <span className="blue-sky-gradient font-semibold">
            browse any anime quickly without loading you directly to a new page
          </span>
          . Click on{" "}
          <span className="red-orange-gradient font-semibold">any anime</span>{" "}
          below to check it out!
        </text>

        <text className="font-bold text-3xl red-orange-gradient">
          Creator's Picks
        </text>
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          slidesPerView={slidesPerView >= 5 ? 5 : slidesPerView + 0.2}
          className="h-[100vh] max-h-[330px] w-full b"
        >
          {anime
            .filter(
              (anime: Anime) =>
                anime.rating !== "Rx - Hentai" &&
                anime.rating !== "R+ - Mild Nudity"
            )
            .map((anime: any, index: number) => (
              <SwiperSlide
                key={anime.mal_id + index}
                className="hover:scale-95"
              >
                <button
                  onClick={() => {
                    setSelectedAnime(anime);
                    console.log(selectedAnime);
                    openDetail(true);
                  }}
                >
                  <div className="relative w-[240px] h-[300px] mx-auto">
                    <Image
                      src={anime.images.webp.large_image_url}
                      alt={anime.title}
                      fill
                      sizes="(max-width: 400px) 100vw, 400px"
                      quality={100}
                      className="rounded-lg"
                    />
                    <AnimeStarRating anime={anime} />
                  </div>
                </button>
              </SwiperSlide>
            ))}
        </Swiper>
        <Link
          href="/search"
          className="p-3 w-full max-w-[300px] rounded-lg border-orange-pop-out
        flex items-center gap-2 justify-center hover:scale-110"
        >
          <text className="red-orange-gradient text-lg font-semibold">
            Go to Website!
          </text>
          <FaArrowRight className="text-yellow-400" />
        </Link>
      </div>
      <ShowAnimeDetail
        detail={detail}
        openDetail={openDetail}
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default Home;
