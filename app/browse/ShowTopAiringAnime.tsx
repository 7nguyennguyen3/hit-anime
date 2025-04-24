"use client"; // Keep directive

// Keep all original imports
import AnimeStarRating from "@/components/AnimeStarRating";
import AnimeSwiper from "@/components/AnimeSwiper";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaLongArrowAltUp, FaRegQuestionCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Anime } from "./page"; // Keep original type import
import { motion } from "framer-motion";
import { useFetchTopAiringAnime, useScrollTop } from "../hook"; // Keep original hook imports
import { useInfiniteQuery } from "@tanstack/react-query";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";

// Keep original Props interface
interface Props {
  selectedAnime: any;
  setSelectedAnime: any;
  openDetail: any;
}

// --- Component Definition (Logic Unchanged) ---
const ShowTopAiringAnime = ({
  openDetail,
  selectedAnime,
  setSelectedAnime,
}: Props) => {
  // --- State and Hooks (Unchanged) ---
  const [gridView, setGridView] = useState(true);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const { ref, inView } = useInView();
  const showScrollTop = useScrollTop(); // Custom hook remains

  // Data fetching hooks remain exactly the same
  const { data: topAiringAnime, isLoading: isLoadingTopAiringAnime } =
    useFetchTopAiringAnime();

  const fetchRecommendedAnime = ({ pageParam }: { pageParam: number }) =>
    axios
      .get(`https://api.jikan.moe/v4/top/anime?page=${pageParam}&limit=20&sfw`)
      .then((res) => res.data);

  const {
    data: recommendationAnime,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // Keep isLoading for initial fetch state
  } = useInfiniteQuery({
    queryKey: ["recommendedAnime"],
    queryFn: fetchRecommendedAnime,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  });

  // Effect hook remains exactly the same
  useEffect(() => {
    if (inView && isInfiniteScroll) {
      // Only fetch if infinite scroll is on
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isInfiniteScroll]); // Added isInfiniteScroll dependency

  // --- Render Logic (Visual/Semantic Improvements Only) ---
  return (
    <>
      {/* Top Airing Section */}
      <div className="px-5 py-8 md:px-8">
        {" "}
        {/* Added padding Y */}
        <h2 className="text-3xl font-bold mb-5 hot-gradient">
          {" "}
          {/* Adjusted margin */}
          Top Airing Anime
        </h2>
        {isLoadingTopAiringAnime ? (
          <div className="flex justify-center items-center h-60">
            {" "}
            {/* Centering loader */}
            <FetchingAnime />
          </div>
        ) : (
          <AnimeSwiper
            // Filtering logic remains the same
            animeData={
              topAiringAnime?.filter(
                (anime: Anime) =>
                  anime.rating !== "Rx - Hentai" &&
                  anime.rating !== "R+ - Mild Nudity"
              ) || []
            } // Added fallback for safety
            onAnimeClick={(anime) => {
              // Click handler logic remains the same
              setSelectedAnime(anime);
              openDetail(true);
            }}
          />
        )}
      </div>

      {/* Recommended Anime Section */}
      <div className="px-5 py-8 md:px-8">
        {" "}
        {/* Added padding Y */}
        <h2 className="text-3xl font-bold mb-5 cold-gradient">
          {" "}
          {/* Adjusted margin */}
          Recommended Anime
        </h2>
        {/* Controls Area - Improved Layout and Semantics */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-slate-800/50 rounded-lg">
          {/* Infinite Scroll Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="infiniteScrollCheck" // Added ID
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-500" // Basic styling
              checked={isInfiniteScroll}
              onChange={() => setIsInfiniteScroll(!isInfiniteScroll)} // Handler unchanged
            />
            {/* Use label for accessibility */}
            <label
              htmlFor="infiniteScrollCheck"
              className="text-sm font-medium text-slate-200 cursor-pointer"
            >
              {isInfiniteScroll ? "Infinite Scroll On" : "Infinite Scroll Off"}
            </label>
            {/* Tooltip */}
            <div className="relative flex items-center">
              <button // Changed to button for semantics
                type="button"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                onMouseEnter={() => setShowTooltip(true)} // Handler unchanged
                onMouseLeave={() => setShowTooltip(false)} // Handler unchanged
                aria-label="Information about infinite scroll" // Accessibility
              >
                <FaRegQuestionCircle size={18} />
              </button>
              {showTooltip && ( // State unchanged
                <div
                  // Improved tooltip style
                  className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-center text-xs font-medium text-white shadow-lg ring-1 ring-white/10"
                >
                  Turn on to automatically load more anime as you scroll down
                  (works in both views).
                </div>
              )}
            </div>
          </div>

          {/* Grid View Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gridViewCheck" // Added ID
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-500" // Basic styling
              checked={gridView}
              onChange={() => setGridView(!gridView)} // Handler unchanged
            />
            {/* Use label for accessibility */}
            <label
              htmlFor="gridViewCheck"
              className="text-sm font-medium text-slate-200 cursor-pointer"
            >
              Grid View
            </label>
          </div>
        </div>
        {/* Conditional Content Display (Logic Unchanged) */}
        {!gridView ? (
          // --- Swiper View ---
          isLoading ? ( // Initial load check unchanged
            <div className="flex justify-center items-center h-96">
              {" "}
              {/* Centering loader */}
              <FetchingAnime />
            </div>
          ) : (
            <>
              <AnimeSwiper
                isInfiniteScroll={isInfiniteScroll} // Prop unchanged
                ref={ref} // Ref unchanged
                // Data mapping unchanged
                animeData={
                  recommendationAnime?.pages.flatMap((page) => page.data) || []
                }
                onAnimeClick={(anime) => {
                  // Click handler logic remains the same
                  setSelectedAnime(anime);
                  openDetail(true);
                }}
              />
              {/* Infinite scroll trigger for swiper */}
              {isInfiniteScroll && <div ref={ref} className="h-10" />}
              {/* Load More Button for Swiper (if infinite scroll is off) */}
              {!isInfiniteScroll && (
                <div className="mt-10 mb-5 flex w-full items-center justify-center">
                  <button
                    className="border-blue-pop-out rounded-lg p-4 w-[200px] transition hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed" // Added hover, focus, disabled styles
                    onClick={() => fetchNextPage()} // Handler unchanged
                    disabled={!hasNextPage || isFetchingNextPage} // Logic unchanged
                  >
                    {/* Text logic unchanged */}
                    <span className="blue-sky-gradient">
                      {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                        ? "Load More"
                        : "Nothing more to load"}
                    </span>
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          // --- Grid View ---
          <>
            <AnimeCardGridLayout>
              {recommendationAnime?.pages
                .flatMap((page) => page.data)
                .map((anime: any, index: number) => (
                  // Card Button Wrapper
                  <button
                    className="rounded-lg transition-transform duration-200 ease-in-out hover:scale-[0.97] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" // Adjusted hover & added focus
                    key={anime.mal_id ?? `anime-${index}`} // Use nullish coalescing for key
                    onClick={() => {
                      // Click handler logic remains the same
                      setSelectedAnime(anime);
                      openDetail(true);
                    }}
                  >
                    {/* Animated Card Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} // Subtle entry animation
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }} // Adjusted duration
                      // Improved card styles
                      className="relative w-full overflow-hidden rounded-lg bg-slate-800 shadow-md h-full"
                      style={{ maxHeight: "300px", minHeight: "250px" }} // Consistent sizing example
                    >
                      {/* Use img tag as original */}
                      <img
                        src={
                          anime.images?.webp?.large_image_url ||
                          anime.images?.jpg?.large_image_url ||
                          "/placeholder.png"
                        } // Added fallback & placeholder
                        alt={
                          anime.title_english || anime.title || "Anime poster"
                        } // Improved alt text
                        loading="lazy"
                        className="w-full h-full object-cover" // Ensure cover
                      />
                      {/* Assuming AnimeStarRating is styled appropriately */}
                      <AnimeStarRating anime={anime} />
                    </motion.div>
                  </button>
                ))}
            </AnimeCardGridLayout>

            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-10">
                <FetchingAnime />
              </div>
            )}

            {/* Infinite scroll trigger for grid */}
            {isInfiniteScroll && <div ref={ref} className="h-10" />}

            {/* Load More Button for Grid (if infinite scroll is off) */}
            {!isInfiniteScroll && hasNextPage && (
              <div className="mt-10 mb-5 flex w-full items-center justify-center">
                <button
                  className="border-blue-pop-out rounded-lg p-4 w-[200px] transition hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed" // Added hover, focus, disabled styles
                  onClick={() => fetchNextPage()} // Handler unchanged
                  disabled={!hasNextPage || isFetchingNextPage} // Logic unchanged
                >
                  {/* Text logic unchanged */}
                  <span className="blue-sky-gradient">
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage
                      ? "Load More"
                      : "Nothing more to load"}
                  </span>
                </button>
              </div>
            )}
            {!isInfiniteScroll && !hasNextPage && !isLoading && (
              <div className="text-center text-slate-400 py-10">
                Nothing more to load
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top Button - Wrapped in motion.div */}
      {showScrollTop && ( // Logic unchanged
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-40" // Position unchanged, added z-index
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // Handler unchanged
            // Improved styling
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Scroll to top" // Accessibility
          >
            <FaLongArrowAltUp size={24} /> {/* Adjusted icon size slightly */}
          </button>
        </motion.div>
      )}
    </>
  );
};

export default ShowTopAiringAnime;
