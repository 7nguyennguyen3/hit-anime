"use client";
import AnimeStarRating from "@/components/AnimeStarRating";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import ShowAnimeDetail from "../browse/ShowAnimeDetail";
import { useEffect, useState } from "react";
import { Anime } from "../browse/page";
import classNames from "classnames";
import { topGenres } from "@/components/data";
import { useInView } from "react-intersection-observer";
import { useDebounce, useScrollTop, useSearchAnime } from "../hook";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";
import { FaLongArrowAltUp } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";

const SearchPage = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);
  const { ref, inView } = useInView();
  const showScrollTop = useScrollTop();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 1000);
  const [status, setStatus] = useState("airing" || "complete");
  const [genres, setGenres] = useState(() => new Set<number>([]));
  const [ratingFilter, setRatingFilter] = useState(6);

  const addGenre = (genre: number) => {
    setGenres((prevGenres) => new Set(prevGenres).add(genre));
  };

  const removeGenre = (genre: number) => {
    setGenres((prevGenres) => {
      const newGenres = new Set(prevGenres);
      newGenres.delete(genre);
      return newGenres;
    });
  };

  const filter = {
    sfw: true,
    limit: 25,
    genres: Array.from(genres).join(","),
    q: debouncedSearchInput,
    sort: "desc",
    status: status,
  };

  const {
    data: recommendationAnime,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearchAnime(filter);

  const [filteredAnime, setFilteredAnime] = useState<any[]>([]);

  useEffect(() => {
    if (recommendationAnime) {
      setFilteredAnime(
        recommendationAnime.pages.flatMap((pageData) =>
          pageData.data.filter((anime: any) => anime.score >= ratingFilter)
        )
      );
    }
  }, [ratingFilter, recommendationAnime]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="p-5 max-w-[1400px] mx-auto min-h-screen">
      <form
        className="flex items-center w-[100%] max-w-[400px] gap-3 relative"
        onSubmit={(event) => {
          event.preventDefault();
          setSearchInput("");
          router.push(`/search/${encodeURIComponent(searchInput)}`);
        }}
      >
        <input
          placeholder="Search for an anime"
          className="p-2 pr-10 text-black rounded-lg w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="absolute z-10 right-2">
          <BiSearch size={25} className="text-black" />
        </button>
      </form>
      <div className="flex items-center my-5 gap-3">
        <label htmlFor="statusToggle" className="mr-2">
          Status:
        </label>
        <input
          type="checkbox"
          id="statusToggle"
          name="statusToggle"
          checked={status === "complete"}
          onChange={(e) => setStatus(e.target.checked ? "complete" : "airing")}
        />
        <text className="text-xl font-semibold blue-sky-gradient">
          {status.toUpperCase()}
        </text>
      </div>

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

      <div className="max-w-[400px] w-full grid grid-cols-3 gap-5">
        {topGenres.map((genre) => (
          <div
            key={genre.id}
            className={classNames(
              "border rounded-lg h-[30px] flex items-center p-2",
              {
                "bg-green-800 border-pop-out": genres.has(genre.id),
              }
            )}
          >
            <button
              onClick={() => {
                if (genres.has(genre.id)) {
                  removeGenre(genre.id);
                } else {
                  addGenre(genre.id);
                }
              }}
            >
              {genre.genre}
            </button>
          </div>
        ))}
      </div>

      <div className="my-10">
        <AnimeCardGridLayout>
          {isLoading ? (
            <FetchingAnime />
          ) : (
            recommendationAnime &&
            filteredAnime.map((anime: any, index: number) => (
              <button
                key={index}
                className="hover:scale-95"
                onClick={() => {
                  setSelectedAnime(anime);
                  openDetail(true);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden mx-auto"
                >
                  <Image
                    src={anime.images.webp.large_image_url}
                    alt={anime.title_english + " Image" || "Anime image"}
                    fill
                    quality={100}
                    sizes="(max-width: 400px) 100vw, 400px"
                  />
                  <AnimeStarRating anime={anime} />
                </motion.div>
              </button>
            ))
          )}
          {isFetchingNextPage && <FetchingAnime />}
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
      <div ref={ref} />
      {(ratingFilter === 8 || genres.size >= 3) && (
        <div className="w-full flex items-center justify-center">
          <button
            className={classNames("border-blue-pop-out p-3 my-5 rounded-lg", {
              "opacity-50 cursor-not-allowed": !hasNextPage,
            })}
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
          >
            {hasNextPage ? "Load More" : "Out of Anime"}
          </button>
        </div>
      )}

      <ShowAnimeDetail
        detail={detail}
        openDetail={openDetail}
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default SearchPage;
