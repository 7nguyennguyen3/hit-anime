"use client";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ShowAnimeDetail from "../ShowAnimeDetail";
import { Anime } from "../page";
import AnimeStarRating from "@/components/AnimeStarRating";

const SearchAnimePage = () => {
  const [searchAnimeData, setSearchAnimeData] = useState([]);
  const [fetchingAnime, setFetchingAnime] = useState(false);
  const searchInput = useParams();
  const [ratingFilter, setRatingFilter] = useState(6);

  const [detail, openDetail] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  let keyword = "";
  if (typeof searchInput.animeName === "string") {
    keyword = decodeURIComponent(searchInput.animeName);
  }

  useEffect(() => {
    const fetchSearchAnime = async () => {
      try {
        setFetchingAnime(true);
        const response = await axios
          .get(`https://api.jikan.moe/v4/anime?q=${keyword}&sfw`)
          .then((res) => res.data);

        setSearchAnimeData(response.data);
        console.log(response.data);
        setFetchingAnime(false);
      } catch (error) {
        console.log(error);
        setFetchingAnime(false);
      }
    };

    fetchSearchAnime();
  }, [keyword]);

  return (
    <div className="px-5 max-w-[1400px] mx-auto">
      {fetchingAnime && (
        <h2 className="font-bold text-3xl">Fetching Anime...</h2>
      )}
      <h2 className="font-bold text-3xl my-5">result: "{keyword}"</h2>
      <div className="flex items-center my-5 gap-3">
        <label htmlFor="ratingFilter" className="mr-2">
          Minimum Rating:
        </label>
        <input
          type="range"
          id="ratingFilter"
          name="ratingFilter"
          min="1"
          max="9"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
        />
        <span className="ml-2">{ratingFilter}</span>
      </div>
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
        {searchAnimeData
          .filter((anime: any) => anime.score >= ratingFilter)
          .map((anime: any, index: number) => (
            <div
              className="relative w-full max-w-[240px] h-[100vh] max-h-[300px] rounded-lg overflow-hidden 
              mx-auto "
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
        <ShowAnimeDetail
          detail={detail}
          openDetail={openDetail}
          selectedAnime={selectedAnime}
        />
      </div>
    </div>
  );
};

export default SearchAnimePage;
