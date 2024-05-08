"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Anime } from "./search/page";
import ShowAnimeDetail from "./search/ShowAnimeDetail";

import AnimeSwiper from "@/components/AnimeSwiper";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";

const animeIds = [52588, 58080, 53446, 51009, 18689, 48895];

const Home = () => {
  const [anime, setAnime] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeByIds = async () => {
      try {
        setIsLoading(true);
        const animePromises = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}`)
        );
        const responses = await Promise.all(animePromises);
        const animeData = responses.map((res) => res.data.data);
        setAnime(animeData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAnimeByIds();
  }, []);

  return (
    <div className="p-5 max-w-[1400px] mx-auto">
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
          below to check it out!
        </text>

        <text className="font-bold text-3xl red-orange-gradient">
          Creator's Picks
        </text>
        {isLoading ? (
          <div
            className="w-full h-[300px] flex 
          items-center justify-center rounded-lg gap-3 text-orange-500"
          >
            <motion.div
              animate={{
                y: ["0%", "30%", "0%"],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <text>Fetching Anime...</text>
            </motion.div>
            <motion.div
              animate={{
                rotate: 360,
                y: ["0%", "30%", "0%"],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ImSpinner3 />
            </motion.div>
          </div>
        ) : (
          <AnimeSwiper
            animeData={anime}
            onAnimeClick={(anime) => {
              setSelectedAnime(anime);
              console.log(anime);
              openDetail(true);
            }}
            maxSlidesPerView={5}
          />
        )}
        <Link
          href="/search"
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
