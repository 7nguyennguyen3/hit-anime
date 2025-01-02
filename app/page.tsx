"use client";
import Image from "next/image";
import { useState } from "react";

import AnimeSwiper from "@/components/AnimeSwiper";
import FetchingAnime from "@/components/layout & common components/FetchingAnime";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useFetchAnimeByIds } from "./hook";
import { Anime } from "./browse/page";
import ShowAnimeDetail from "./browse/ShowAnimeDetail";
import { prefetchedAnimes } from "./_prefetchedAnime/anime";

const Home = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);

  return (
    <div className="p-5 max-w-[1400px] min-h-screen mx-auto">
      <div
        className="w-full max-w-[1000px] mx-auto bg-slate-800 rounded-lg p-5
      flex flex-col gap-5"
      >
        <Image src="/logo.png" alt="Logo Image" width={200} height={100} />
        <text className="text-lg font-medium">
          Welcome to Hit Anime! Your friendly anime app using the free and
          almighty Jikan API(MyAnimeList) for searching your next anime. Our
          features are optimized for you to{" "}
          <span className="blue-sky-gradient font-semibold">
            browse any anime quickly without loading you directly to a new page
          </span>
          . Click on{" "}
          <span className="red-orange-gradient font-semibold">any anime</span>{" "}
          below to check it out! And I really recommend you try out the COSMIC
          SEARCH.
        </text>

        <text className="font-bold text-3xl red-orange-gradient">
          Creator's Picks
        </text>

        <AnimeSwiper
          animeData={prefetchedAnimes}
          onAnimeClick={(anime) => {
            setSelectedAnime(anime);
            openDetail(true);
          }}
          maxSlidesPerView={5}
        />

        <Link
          href="/browse"
          className="p-3 w-full max-w-[300px] rounded-lg border-orange-pop-out
        flex items-center gap-2 justify-center hover:scale-110"
        >
          <text className="red-orange-gradient text-lg font-semibold">
            Go to Website!
          </text>
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
