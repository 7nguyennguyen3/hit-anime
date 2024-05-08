import AnimeStarRating from "@/components/AnimeStarRating";
import AnimeSwiper from "@/components/AnimeSwiper";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLongArrowAltUp, FaRegQuestionCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Anime } from "./page";

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
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [recommendationAnime, setRecommendationAnime] = useState<any[]>([]);
  const [fetchingAnime, setFetchingAnime] = useState(true);
  const [page, setPage] = useState(1);

  const [gridView, setGridView] = useState(false);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { ref, inView } = useInView();

  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadMoreAnime = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);

  useEffect(() => {
    if (inView && isInfiniteScroll) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  useEffect(() => {
    const fetchTopAiringAnime = async () => {
      try {
        setFetchingAnime(true);
        const response = await axios
          .get(`https://api.jikan.moe/v4/top/anime?filter=airing&page=1&sfw`)
          .then((res) => res.data);
        setTopAiringAnime(response.data);
        console.log(response.data);
        setFetchingAnime(false);
      } catch (error) {
        console.log(error);
        setFetchingAnime(false);
      }
    };

    fetchTopAiringAnime();
  }, []);

  useEffect(() => {
    const fetchRecommendedAnime = async () => {
      try {
        setFetchingAnime(true);
        const response = await axios
          .get(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=20&sfw`)
          .then((res) => res.data);
        setRecommendationAnime((prevAnime) => [...prevAnime, ...response.data]);
        console.log(response.data);
        setFetchingAnime(false);
      } catch (error) {
        console.log(error);
        setFetchingAnime(false);
      }
    };

    fetchRecommendedAnime();
  }, [page]);

  return (
    <>
      <div className="px-5 my-10">
        <h2 className="text-2xl font-bold my-5">Top Airing Anime</h2>
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
      </div>
      <div className="px-5">
        <h2 className="text-2xl font-bold my-5">Recommended Anime</h2>
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
          <AnimeSwiper
            fetchingAnime={fetchingAnime}
            animeData={recommendationAnime}
            onAnimeClick={(anime) => {
              setSelectedAnime(anime);
              console.log(anime);
              openDetail(true);
            }}
            loadSlide={true}
            onLoadMore={loadMoreAnime}
          />
        ) : (
          <div
            className="
            relative
        gap-5
        grid
        xxs: grid-cols-1   
        xs:grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6"
          >
            {recommendationAnime.map((anime: any, index: number) => (
              <div
                className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden 
              mx-auto hover:scale-105"
                key={anime.mal_id ? anime.mal_id : index}
                onClick={() => {
                  setSelectedAnime(anime);
                  openDetail(true);
                }}
              >
                <Image
                  src={anime.images.webp.large_image_url}
                  alt={anime.title_english + "Image" || "Anime image"}
                  fill
                  quality={100}
                  sizes="(max-width: 400px) 100vw, 400px"
                />
                <AnimeStarRating anime={anime} />
              </div>
            ))}

            <div ref={ref} />
            {showScrollTop && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-3 right-3 p-2 bg-blue-500 text-white rounded-full"
              >
                <FaLongArrowAltUp className="text-[24px]" />
              </button>
            )}
          </div>
        )}
        {gridView && !isInfiniteScroll && (
          <button
            className="border p-4 w-[300px] my-20 rounded-lg"
            onClick={() => setPage(page + 1)}
          >
            Load More...
          </button>
        )}
      </div>
    </>
  );
};

export default ShowTopAiringAnime;
