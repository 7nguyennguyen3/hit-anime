"use client";

import AnimeStarRating from "@/components/AnimeStarRating";
import { genresId, topGenres } from "@/components/data";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaLongArrowAltUp,
  FaRegQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Anime } from "../browse/page";
import ShowAnimeDetail from "../browse/ShowAnimeDetail";
import { useDebounce, useScrollTop, useSearchAnime } from "../hook";
import DatePicker from "./DatePicker";
import ResetFilter from "./ResetFilter";
import StatusPicker, { Status } from "./StatusPicker";

const allGenres = [...topGenres, ...genresId];

const SearchPage = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { ref: infiniteScrollRef, inView: isInfiniteScrollTriggerInView } =
    useInView({ threshold: 0.5 });
  const showScrollTopButton = useScrollTop();
  const [ratingFilter, setRatingFilter] = useState(6);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 700);
  const [status, setStatus] = useState<Status>("complete");
  const [genres, setGenres] = useState(() => new Set<number>([]));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [showExactMatchTooltip, setShowExactMatchTooltip] = useState(false);

  const addGenre = (genreId: number) => {
    setGenres((prevGenres) => new Set(prevGenres).add(genreId));
  };

  const removeGenre = (genreId: number) => {
    setGenres((prevGenres) => {
      const newGenres = new Set(prevGenres);
      newGenres.delete(genreId);
      return newGenres;
    });
  };

  const searchQuery = isExactMatch
    ? debouncedSearchInput.trim().replace(/\s+/g, "")
    : debouncedSearchInput.trim();

  const apiFilter = {
    sfw: true,
    limit: 24,
    genres: Array.from(genres).join(","),
    q: searchQuery,
    status: status,
    start_date: startDate,
    end_date: endDate,
    order_by: "popularity",
  };

  const {
    data: animePagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInitiallyLoading,
    isFetching: isFetchingData,
  } = useSearchAnime(apiFilter);

  const [filteredAnimeList, setFilteredAnimeList] = useState<Anime[]>([]);

  const removeDuplicates = <T extends { [key: string]: any }>(
    array: T[],
    key: string
  ): T[] => {
    const seen = new Set<any>();
    return array.filter((item) => {
      const identifier = item[key];
      if (!seen.has(identifier)) {
        seen.add(identifier);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    if (animePagesData?.pages) {
      const allAnime = animePagesData.pages.flatMap(
        (page: any) => page?.data || []
      );

      const animeMeetingRatingCriteria = allAnime.filter(
        (anime: Anime) =>
          status === "upcoming" || !anime.score || anime.score >= ratingFilter
      );

      const uniqueAnime = removeDuplicates(
        animeMeetingRatingCriteria,
        "mal_id"
      );
      setFilteredAnimeList(uniqueAnime);
    } else {
      setFilteredAnimeList([]);
    }
  }, [ratingFilter, animePagesData, status]);

  useEffect(() => {
    if (isInfiniteScrollTriggerInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    isInfiniteScrollTriggerInView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const handleAnimeCardClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAnime(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div
      className="flex flex-col lg:flex-row gap-8 p-4 
    sm:p-6 max-w-[1500px] mx-auto min-h-screen bg-gray-900
    text-gray-100 font-inter"
    >
      {/* Filter Sidebar/Section */}
      <aside
        className="w-full lg:w-1/4 xl:w-1/5 flex flex-col gap-6 p-4 bg-gray-800 rounded-xl 
      shadow-lg self-start lg:sticky lg:top-4 z-10"
      >
        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
          Filters
        </h2>

        {/* Search Input & Options */}
        <div className="flex flex-col gap-3">
          <label htmlFor="anime-search" className="font-medium text-gray-300">
            Search Title
          </label>
          <div className="relative">
            <input
              id="anime-search"
              type="text"
              placeholder="e.g., Naruto, One Piece..."
              className="w-full p-2 pl-8 pr-4 text-black bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="exact-match"
              className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-0"
              checked={isExactMatch}
              onChange={(e) => setIsExactMatch(e.target.checked)}
            />
            <label htmlFor="exact-match" className="text-sm text-gray-300">
              Exact Match
            </label>
            <div className="relative flex items-center">
              <FaRegQuestionCircle
                size={16}
                className="text-blue-400 cursor-help ml-1"
                onMouseEnter={() => setShowExactMatchTooltip(true)}
                onMouseLeave={() => setShowExactMatchTooltip(false)}
              />
              {showExactMatchTooltip && (
                <div className="absolute z-30 bg-gray-900 border border-gray-700 p-3 rounded-md shadow-lg top-full mt-2 left-1/2 transform -translate-x-1/2 w-48 text-xs text-gray-200">
                  Removes spaces for precise title matching (e.g., 'Attack
                  Titan' becomes 'AttackTitan').
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Picker */}
        <StatusPicker setStatus={setStatus} status={status} />

        {/* Rating Filter */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="ratingFilter"
            className="font-medium text-gray-300 flex justify-between items-center"
          >
            Minimum Rating:{" "}
            <span className="font-bold text-blue-400 text-lg">
              {ratingFilter}
            </span>
          </label>
          <input
            type="range"
            id="ratingFilter"
            name="ratingFilter"
            min="1"
            max="9"
            step="1"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            // Disable if status is 'upcoming' as ratings may not apply
            disabled={status === "upcoming"}
          />
          {status === "upcoming" && (
            <span className="text-xs text-gray-400 italic">
              Rating filter disabled for 'Upcoming' status.
            </span>
          )}
        </div>

        <DatePicker
          setStartDate={setStartDate}
          addGenre={addGenre}
          genres={genres}
          removeGenre={removeGenre}
          endDate={endDate}
          setEndDate={setEndDate}
          startDate={startDate}
        />

        {/* Genre Filters */}
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-gray-300 border-t border-gray-700 pt-3">
            Top Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {topGenres.map((genre) => {
              const isSelected = genres.has(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => {
                    if (isSelected) {
                      removeGenre(genre.id);
                    } else {
                      addGenre(genre.id);
                    }
                  }}
                  className={classNames(
                    "px-3 py-1 text-sm rounded-full border transition-colors duration-200 ease-in-out",
                    {
                      "bg-blue-600 border-blue-500 text-white hover:bg-blue-700":
                        isSelected,
                      "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500":
                        !isSelected,
                    }
                  )}
                >
                  {genre.genre}
                </button>
              );
            })}
            {/* Optionally add a button to show all genres in a modal */}
            {/* <button className="text-sm text-blue-400 hover:underline mt-1">Show all genres...</button> */}
          </div>
          {/* Display selected non-top genres (if any) */}
          {Array.from(genres)
            .filter((id) => !topGenres.some((tg) => tg.id === id))
            .map((genreId) => {
              const genre = allGenres.find((g) => g.id === genreId);
              return genre ? (
                <div
                  key={genreId}
                  className="flex items-center gap-2 text-sm bg-gray-600 px-2 py-1 rounded"
                >
                  <span>{genre.genre}</span>
                  <button
                    onClick={() => removeGenre(genreId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : null;
            })}
        </div>

        <ResetFilter
          setEndDate={setEndDate}
          setGenres={setGenres}
          setStartDate={setStartDate}
          setStatus={setStatus}
          setSearchInput={setSearchInput}
        />
      </aside>

      {/* Main Content Area */}
      <main className="w-full lg:w-3/4 xl:w-4/5 flex flex-col gap-5">
        {/* Result Text */}
        {searchQuery && !isInitiallyLoading && (
          <p className="font-semibold text-xl sm:text-2xl text-gray-200">
            {`Showing results for: "${searchQuery}"`}
          </p>
        )}
        {!searchQuery && !isInitiallyLoading && (
          <p className="font-semibold text-xl sm:text-2xl text-gray-200">
            Browse Anime
          </p>
        )}

        {/* Anime Grid */}
        <div className="flex-grow">
          <AnimeCardGridLayout>
            {/* Initial Loading State */}
            {isInitiallyLoading ? (
              // Render skeleton loaders based on the limit
              Array.from({ length: apiFilter.limit }).map((_, index) => (
                <FetchingAnime key={`skeleton-${index}`} />
              ))
            ) : filteredAnimeList.length === 0 && !isFetchingData ? (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-10 h-60 bg-gray-800 rounded-lg">
                <img
                  src="https://placehold.co/100x100/718096/E2E8F0?text=Oops!"
                  alt="No results icon"
                  className="w-16 h-16 mb-4 opacity-50 rounded-full"
                />
                <p className="text-xl font-semibold text-gray-400">
                  No Anime Found
                </p>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              filteredAnimeList.map((anime: Anime, index: number) => (
                <motion.button
                  key={anime.mal_id || index}
                  className="relative group focus:outline-none focus:ring-2 focus:ring-offset-2
                             focus:ring-offset-gray-900 focus:ring-blue-500 rounded-lg"
                  onClick={() => handleAnimeCardClick(anime)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: (index % apiFilter.limit) * 0.05,
                  }} // Stagger animation
                >
                  {/* This is the container for the image and overlay */}
                  <div
                    className="relative w-full aspect-[2/3] rounded-lg
                               overflow-hidden shadow-md transition-transform duration-300
                               ease-in-out group-hover:scale-105" // <<< aspect-[2/3] is here!
                  >
                    <img
                      src={
                        anime.images?.webp?.large_image_url ||
                        anime.images?.jpg?.large_image_url ||
                        "https://placehold.co/240x360/374151/9CA3AF?text=No+Image"
                      }
                      alt={anime.title_english || anime.title || "Anime image"}
                      loading="lazy"
                      className="w-full h-full object-cover" // <<< Fills the container
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/240x360/374151/9CA3AF?text=Error")
                      }
                    />
                    {/* Overlay Div */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80
                                 via-black/30 to-transparent opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 flex flex-col justify-end p-3"
                    >
                      <h3 className="text-white text-sm font-semibold drop-shadow-md line-clamp-2">
                        {anime.title_english || anime.title}
                      </h3>
                    </div>
                    <AnimeStarRating anime={anime} />
                  </div>
                </motion.button>
              ))
            )}

            {/* Loading More Indicator */}
            {isFetchingNextPage &&
              // Render skeleton loaders when fetching next page
              Array.from({ length: 4 }).map(
                (
                  _,
                  index // Show fewer skeletons for loading more
                ) => <FetchingAnime key={`loading-more-${index}`} />
              )}
          </AnimeCardGridLayout>
        </div>

        {/* Infinite Scroll Trigger & Load More Button/Indicator */}
        <div
          ref={infiniteScrollRef}
          className="h-10 flex items-center justify-center mt-8"
        >
          {!isInitiallyLoading &&
            !isFetchingNextPage &&
            !hasNextPage &&
            filteredAnimeList.length > 0 && (
              <p className="text-gray-500">You've reached the end!</p>
            )}
          {hasNextPage && !isFetchingNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </main>

      {/* Scroll To Top Button */}
      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out z-20 animate-bounce"
          aria-label="Scroll to top"
        >
          <FaLongArrowAltUp size={24} />
        </button>
      )}

      {/* Details Modal */}
      <ShowAnimeDetail
        detail={isDetailModalOpen} // Use state variable for modal visibility
        openDetail={handleCloseDetailModal} // Pass the close handler
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default SearchPage;
