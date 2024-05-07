import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegQuestionCircle, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Anime } from "./page";
import AnimeStarRating from "@/components/AnimeStarRating";
import { useInView } from "react-intersection-observer";

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
  const [fetchingAnime, setFetchingAnime] = useState(false);
  const [page, setPage] = useState(1);

  const [slidesPerView, setSlidesPerView] = useState(1);
  const [gridView, setGridView] = useState(false);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    const calculateSlidesPerView = () => {
      const imageView = Math.floor(window.innerWidth / 240);
      setSlidesPerView(imageView);
    };

    calculateSlidesPerView();
    window.addEventListener("resize", calculateSlidesPerView);

    return () => {
      window.removeEventListener("resize", calculateSlidesPerView);
    };
  }, []);

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
        const response = await axios
          .get(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=20&sfw`)
          .then((res) => res.data);
        setRecommendationAnime((prevAnime) => [...prevAnime, ...response.data]);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecommendedAnime();
  }, [page]);

  return (
    <>
      <div className="px-5 my-10">
        <h2 className="text-2xl font-bold my-5">Top Airing Anime</h2>
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          slidesPerView={slidesPerView + 0.35}
          className="h-[100vh] max-h-[330px] w-full b"
        >
          {topAiringAnime
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
                  className="z-20 absolute bg-white opacity-90 p-5 rounded-lg top-[25px]
              w-[200px] text-black font-semibold"
                >
                  Turn on to load more anime as you scroll.
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
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            slidesPerView={slidesPerView + 0.35}
            className="h-[100vh] max-h-[330px] w-full b"
          >
            {recommendationAnime.map((anime: any, index: number) => (
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
                    <div
                      className="w-[60px] h-[30px] bg-white opacity-80 text-black absolute 
          top-0 left-0 flex items-center rounded-lg"
                    >
                      <div className="flex items-center justify-center align-middle px-1 gap-1">
                        <FaStar className="text-yellow-500 text-lg" />
                        <text className="text-sm font-semibold">
                          {anime.score}
                        </text>
                      </div>
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <div
                className="relative w-[240px] h-[300px] border bg-inherit flex 
            items-center justify-center rounded-lg"
              >
                <button
                  className="border border-white p-2"
                  disabled={fetchingAnime}
                  onClick={async () => {
                    setPage(page + 1);
                  }}
                >
                  <text>
                    {!fetchingAnime ? "Load More" : "Fetching Anime..."}
                  </text>
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        ) : (
          <div
            className="
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
          </div>
        )}
        <button
          className="border p-4 w-[300px] mb-20"
          onClick={() => setPage(page + 1)}
        >
          Load More...
        </button>
      </div>
    </>
  );
};

export default ShowTopAiringAnime;
