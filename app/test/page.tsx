"use client";
import Image from "next/image";

import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

let page = 1;

export type AnimeCard = JSX.Element;

const TestPage = () => {
  const [data, setData] = useState<AnimeCard[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://shikimori.one/api/animes?page=${page}&limit=12&order=popularity`
      );
      const data = await response.json();
      setData(data);
      console.log(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (inView) {
      const fetchData = async () => {
        const response = await fetch(
          `https://shikimori.one/api/animes?page=${page}&limit=12&order=popularity`
        );
        const newData = await response.json();
        setData((prevData) => [...prevData, ...newData]);
        page++;
      };
      fetchData();
    }
  }, [inView]);

  useEffect(() => {
    const handleResize = () => {
      const newSlidesPerView = Math.floor(window.innerWidth / 210);
      setSlidesPerView(newSlidesPerView > 5 ? 5 : newSlidesPerView);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="border p-5 max-w-[1400px] mx-auto">
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={50}
        className="h-[100vh] max-h-[500px]"
      >
        {data.map((anime: any) => (
          <SwiperSlide key={anime.id}>
            <div className="relative w-[210px] h-[300px] mx-auto">
              <Image
                src={`https://shikimori.one${anime.image.original}`}
                alt={anime.name}
                fill
                sizes="(max-width: 400px) 100vw, 400px"
                quality={100}
                className="rounded-lg"
                style={{ objectFit: "fill" }}
              />
            </div>
            <div className="flex justify-center my-3 items-center text-sm">
              {anime.name}
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <div ref={ref} className="border">
            <Image
              src="/spinner.gif"
              alt="loading"
              width={100}
              height={100}
              className="border"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default TestPage;
