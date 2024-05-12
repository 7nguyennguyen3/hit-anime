"use client";
import { useFetchSearchAnime, useScrollTop } from "@/app/hook";
import AnimeStarRating from "@/components/AnimeStarRating";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";
import ShowAnimeDetail from "../../browse/ShowAnimeDetail";
import { Anime } from "../../browse/page";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const SearchAnimePage = () => {
  const searchInput = useParams();
  const [ratingFilter, setRatingFilter] = useState(6);

  const [detail, openDetail] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const showScrollTop = useScrollTop();

  let keyword = "";
  if (typeof searchInput.animeName === "string") {
    keyword = decodeURIComponent(searchInput.animeName);
  }

  const { data: searchAnimeData, isLoading } = useFetchSearchAnime(keyword);

  return (
    <div className="px-5 max-w-[1400px] min-h-screen mx-auto relative">
      <Link
        href="/search"
        className="border p-3 rounded-lg border-orange-pop-out flex items-center gap-2 max-w-[250px]
        hover:scale-110"
      >
        <text className="red-orange-gradient text-xl font-semibold">
          Try Cosmic Search
        </text>
        <FaArrowRight className="text-yellow-500" />
      </Link>
      <h2 className="font-bold text-3xl my-5 mt-10">result: "{keyword}"</h2>
      <div className="flex items-center my-5 gap-3">
        <label htmlFor="ratingFilter" className="mr-2">
          Minimum Rating:
        </label>
        <input
          type="range"
          id="ratingFilter"
          name="ratingFilter"
          min="1"
          max="9"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
        />
        <span className="ml-2">{ratingFilter}</span>
      </div>
      {isLoading && <FetchingAnime />}
      <AnimeCardGridLayout>
        {searchAnimeData &&
          searchAnimeData
            .filter((anime: any) => anime.score >= ratingFilter)
            .map((anime: any, index: number) => (
              <button
                className="hover:scale-95"
                key={anime.mal_id ? anime.mal_id : index}
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.13 }}
                  className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden 
              mx-auto "
                  onClick={() => {
                    setSelectedAnime(anime);
                    openDetail(true);
                  }}
                >
                  <img
                    src={anime.images.webp.large_image_url}
                    alt={anime.title_english + "Image" || "Anime image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <AnimeStarRating anime={anime} />
                </motion.div>
              </button>
            ))}
        <ShowAnimeDetail
          detail={detail}
          openDetail={openDetail}
          selectedAnime={selectedAnime}
        />
      </AnimeCardGridLayout>
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-3 right-3 p-2 bg-blue-500 text-white rounded-full"
        >
          <FaLongArrowAltUp className="text-[24px]" />
        </button>
      )}
    </div>
  );
};

export default SearchAnimePage;
