"use client";
import AnimeStarRating from "@/components/AnimeStarRating";
import { genresId, topGenres } from "@/components/data";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaLongArrowAltUp, FaRegQuestionCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { Anime } from "../browse/page";
import ShowAnimeDetail from "../browse/ShowAnimeDetail";
import { useDebounce, useScrollTop, useSearchAnime } from "../hook";
import DatePicker from "./DatePicker";
import ResetFilter from "./ResetFilter";
import StatusPicker from "./StatusPicker";

const allGenres = [...topGenres, ...genresId];

const SearchPage = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);
  const { ref, inView } = useInView();
  const showScrollTop = useScrollTop();
  const [ratingFilter, setRatingFilter] = useState(6);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 1000);
  const [status, setStatus] = useState("complete" || "airing" || "upcoming");
  const [genres, setGenres] = useState(() => new Set<number>([]));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isSpecificSearch, setIsSpecificSearch] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const searchQuery = isSpecificSearch
    ? debouncedSearchInput.replace(/\s/g, "")
    : debouncedSearchInput;

  const filter = {
    sfw: true,
    limit: 20,
    genres: Array.from(genres).join(","),
    q: searchQuery,
    status: status,
    start_date: startDate,
    end_date: endDate,
    order_by: "popularity",
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
      const animeWithRatings = recommendationAnime.pages.flatMap(
        (pageData: any) =>
          pageData.data.filter((anime: any) => anime.score >= ratingFilter)
      );
      setFilteredAnime(removeDuplicates(animeWithRatings, "mal_id"));
    }
  }, [ratingFilter, recommendationAnime]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const removeDuplicates = <T extends { [key: string]: any }>(
    array: T[],
    key: string
  ): T[] => {
    return array.reduce((accumulator: T[], current: T) => {
      if (!accumulator.find((item) => item[key] === current[key])) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
  };

  return (
    <div className="p-5 max-w-[1400px] mx-auto min-h-screen flex flex-col gap-7">
      <div className="flex flex-col items-center gap-5">
        <input
          placeholder="Search for an anime"
          className="p-2 pr-10 text-black rounded-lg w-full max-w-[500px] mr-auto"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="flex items-center mr-auto">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSpecificSearch}
              onChange={(e) => setIsSpecificSearch(e.target.checked)}
            />
            Focus Search
          </label>
          <div className="relative ml-2 text-blue-500 cursor-pointer">
            <FaRegQuestionCircle
              size={20}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                className="z-20 absolute bg-white opacity-90 p-5 rounded-lg top-[25px] left-[-100px]
              w-[200px] text-black font-semibold"
              >
                Turn on to search for specific anime.
              </div>
            )}
          </div>
        </div>
      </div>
      {searchInput !== "" && (
        <text className="font-semibold text-2xl">{`Result for: "${searchInput}"`}</text>
      )}
      <StatusPicker setStatus={setStatus} status={status} />

      <div className="flex xs:flex-row xxs:flex-col gap-5">
        <div className="flex items-center gap-2">
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
        <ResetFilter
          setEndDate={setEndDate}
          setGenres={setGenres}
          setStartDate={setStartDate}
          setStatus={setStatus}
          setSearchInput={setSearchInput}
        />
      </div>

      <div className="flex flex-wrap items-center gap-5 w-full">
        <text className="font-semibold text-lg">Filtering for:</text>
        <div className="border p-2 rounded-lg">{status}</div>
        {Array.from(genres).map((genreId) => {
          const genre = allGenres.find((g) => g.id === genreId);
          return genre ? (
            <div key={genreId} className="border p-2 rounded-lg relative">
              <button
                className="absolute top-[-12px] right-[-12px] text-[26px] 
                text-blue-500 font-bold"
                onClick={() => removeGenre(genre.id)}
              >
                <IoClose />
              </button>
              {genre.genre}
            </div>
          ) : null;
        })}
        {startDate && (
          <div className="border p-2 rounded-lg relative">
            <button
              className="absolute top-[-12px] right-[-12px] text-[26px] 
              text-blue-500 font-bold"
              onClick={() => setStartDate("")}
            >
              <IoClose />
            </button>
            Started by: {startDate}
          </div>
        )}
        {endDate && (
          <div className="border p-2 rounded-lg relative">
            <button
              className="absolute top-[-12px] right-[-12px] text-[26px] 
              text-blue-500 font-bold"
              onClick={() => setEndDate("")}
            >
              <IoClose />
            </button>
            Ended by: {endDate}
          </div>
        )}
      </div>

      <DatePicker
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        addGenre={addGenre}
        removeGenre={removeGenre}
        genres={genres}
      />

      <div className="max-w-[500px] w-full grid sm:grid-cols-4 xs:grid-cols-3 xxs:grid-cols-2 gap-5">
        {topGenres.map((genre) => (
          <div
            key={genre.id}
            onClick={() => {
              if (genres.has(genre.id)) {
                removeGenre(genre.id);
              } else {
                addGenre(genre.id);
              }
            }}
            className={classNames(
              "border rounded-lg h-[30px] flex items-center p-2",
              {
                "bg-green-800 border-pop-out": genres.has(genre.id),
              }
            )}
          >
            {genre.genre}
          </div>
        ))}
      </div>
      <div className="my-10">
        <AnimeCardGridLayout>
          {isLoading ? (
            <FetchingAnime />
          ) : (
            recommendationAnime &&
            (status === "upcoming"
              ? removeDuplicates(
                  recommendationAnime.pages.flatMap((page) => page.data),
                  "mal_id"
                )
              : filteredAnime
            ).map((anime: any, index: number) => (
              <button
                key={index}
                className="hover:scale-95"
                onClick={() => {
                  setSelectedAnime(anime);
                  openDetail(true);
                  console.log(anime);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden mx-auto"
                >
                  <img
                    src={anime.images.webp.large_image_url}
                    alt={anime.title_english + " Image" || "Anime image"}
                    loading="lazy"
                    className="w-full h-full object-cover"
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
      {(ratingFilter === 8 || genres.size >= 3 || !hasNextPage) && (
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
