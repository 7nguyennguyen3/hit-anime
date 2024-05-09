import AnimeStarRating from "@/components/AnimeStarRating";
import AnimeSwiper from "@/components/AnimeSwiper";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLongArrowAltUp, FaRegQuestionCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Anime } from "./page";
import { motion } from "framer-motion";
import { useFetchTopAiringAnime, useScrollTop } from "../hook";
import { useInfiniteQuery } from "@tanstack/react-query";
import AnimeCardGridLayout from "@/components/layout & common components/AnimeCardGridLayout";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";

interface Props {
  selectedAnime: any;
  setSelectedAnime: any;
  openDetail: any;
}

const ShowTopAiringAnime = ({
  openDetail,
  selectedAnime,
  setSelectedAnime,
}: Props) => {
  const [gridView, setGridView] = useState(false);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { ref, inView } = useInView();

  const showScrollTop = useScrollTop();

  const { data: topAiringAnime, isLoading: isLoadingTopAiringAnime } =
    useFetchTopAiringAnime();

  const fetchRecommendedAnime = ({ pageParam = 1 }) =>
    axios
      .get(`https://api.jikan.moe/v4/top/anime?page=${pageParam}&limit=20&sfw`)
      .then((res) => res.data);

  const {
    data: recommendationAnime,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recommendedAnime"],
    queryFn: fetchRecommendedAnime,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <div className="px-5">
        <h2 className="text-3xl font-bold my-5 hot-gradient">
          Top Airing Anime
        </h2>
        {isLoadingTopAiringAnime ? (
          <FetchingAnime />
        ) : (
          <AnimeSwiper
            animeData={topAiringAnime.filter(
              (anime: Anime) =>
                anime.rating !== "Rx - Hentai" &&
                anime.rating !== "R+ - Mild Nudity"
            )}
            onAnimeClick={(anime) => {
              setSelectedAnime(anime);
              console.log(selectedAnime);
              openDetail(true);
            }}
          />
        )}
      </div>
      <div className="px-5">
        <h2 className="text-3xl font-bold my-5 cold-gradient">
          Recommended Anime
        </h2>
        <div className="flex flex-col my-5">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isInfiniteScroll}
              onChange={() => setIsInfiniteScroll(!isInfiniteScroll)}
            />
            <text className="ml-2">
              {isInfiniteScroll ? "Infinite Scroll On" : "Infinite Scroll Off"}
            </text>
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
                  Turn on to load more anime as you scroll (Grid View Only).
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={gridView}
              onChange={() => setGridView(!gridView)}
            />
            <text className="ml-2">Grid View</text>
          </div>
        </div>
        {!gridView ? (
          isLoading ? (
            <FetchingAnime />
          ) : (
            <>
              <AnimeSwiper
                isInfiniteScroll={isInfiniteScroll}
                ref={ref}
                animeData={
                  recommendationAnime?.pages.flatMap((page) => page.data) || []
                }
                onAnimeClick={(anime) => {
                  setSelectedAnime(anime);
                  console.log(anime);
                  openDetail(true);
                }}
              />
              <div ref={ref} />
              <div className="w-full flex items-center justify-center">
                <button
                  className="border-blue-pop-out p-4 w-[200px] my-20 rounded-lg"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Load More"
                    : "Nothing more to load"}
                </button>
              </div>
            </>
          )
        ) : (
          <AnimeCardGridLayout>
            {recommendationAnime?.pages
              .flatMap((page) => page.data)
              .map((anime: any, index: number) => (
                <button
                  className="hover:scale-95"
                  key={anime.mal_id ? anime.mal_id : index}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      // delay: index * 0.1,
                    }}
                    className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden 
        mx-auto cursor-pointer"
                    onClick={() => {
                      setSelectedAnime(anime);
                      openDetail(true);
                    }}
                  >
                    <Image
                      src={anime.images.webp?.large_image_url || ""}
                      alt={anime.title_english + "Image" || "Anime image"}
                      fill
                      quality={100}
                      sizes="(max-width: 400px) 100vw, 400px"
                    />
                    <AnimeStarRating anime={anime} />
                  </motion.div>
                </button>
              ))}

            {showScrollTop && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-3 right-3 p-2 bg-blue-500 text-white rounded-full"
              >
                <FaLongArrowAltUp className="text-[24px]" />
              </button>
            )}
          </AnimeCardGridLayout>
        )}
        {isInfiniteScroll && <div ref={ref} />}
        {gridView && !isInfiniteScroll && (
          <div className="w-full flex items-center justify-center">
            <button
              className="border-blue-pop-out p-4 w-[200px] my-20 rounded-lg"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowTopAiringAnime;
