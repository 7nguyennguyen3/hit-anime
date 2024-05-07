"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimeCard from "./AnimeCard";
import { fetchAnime } from "./action";

let page = 2;

export type AnimeCard = JSX.Element;

function LoadMore() {
  const { ref, inView } = useInView();
  const [data, setData] = useState<AnimeCard[]>([]);

  useEffect(() => {
    if (inView) {
      fetchAnime(page).then((res) => {
        setData([...data, ...res]);
        page++;
      });
    }
  }, [inView, data]);

  return (
    <>
      <section
        className="grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-4
        1260:grid-cols-4
        xl:grid-cols-4
        2xl:grid-cols-4
        gap-5"
      >
        {data}
      </section>
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          <Image
            src="/spinner.gif"
            alt="spinner"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
}

export default LoadMore;
