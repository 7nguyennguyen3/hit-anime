"use client";
import Image from "next/image";
import { useState } from "react";

import AnimeSwiper from "@/components/AnimeSwiper";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { prefetchedAnimes } from "./_prefetchedAnime/anime";
import { Anime } from "./browse/page";
import ShowAnimeDetail from "./browse/ShowAnimeDetail";

const Home = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] p-5 md:p-8">
      <div className="mx-auto mb-10 w-full max-w-[1000px] rounded-lg bg-slate-800 p-6 shadow-xl ring-1 ring-white/5 flex flex-col space-y-6">
        <Image
          src="/logo.png"
          alt="Hit Anime Application Logo"
          width={200}
          height={100}
          priority
          className="self-start"
        />

        <p className="text-lg font-medium text-slate-200 leading-relaxed">
          Welcome to Hit Anime! Your friendly anime app using the free and
          almighty Jikan API (MyAnimeList) for searching your next anime. Our
          features are optimized for you to{" "}
          <span className="blue-sky-gradient font-semibold">
            browse any anime quickly without loading you directly to a new page
          </span>
          . Click on
          <span className="red-orange-gradient font-semibold">
            {" "}
            any anime
          </span>{" "}
          below to check it out! And I really recommend you try out the
          <span className="red-orange-gradient font-semibold">
            {" "}
            COSMIC SEARCH
          </span>
          .
        </p>
      </div>

      <div className="mx-auto mb-10 w-full max-w-[1000px]">
        <h2 className="mb-5 text-3xl font-bold red-orange-gradient">
          Creator's Picks
        </h2>

        <AnimeSwiper
          animeData={prefetchedAnimes as Anime[]}
          onAnimeClick={(anime) => {
            setSelectedAnime(anime);
            openDetail(true);
          }}
          maxSlidesPerView={5}
        />
      </div>

      <div className="mx-auto mb-10 flex w-full max-w-[1000px] justify-center md:justify-start">
        <Link
          href="/browse"
          className="inline-flex max-w-xs items-center justify-center gap-2 rounded-lg p-3 
                     border-orange-pop-out 
                     transition-transform duration-200 ease-in-out hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <span className="red-orange-gradient text-lg font-semibold">
            Go to Website!
          </span>
          <FaArrowRight className="text-yellow-400" />
        </Link>
      </div>

      <ShowAnimeDetail
        detail={detail}
        openDetail={openDetail}
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default Home;
