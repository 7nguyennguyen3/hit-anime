"use client";
import { useState } from "react";

import ShowAnimeDetail from "./ShowAnimeDetail";
import ShowTopAiringAnime from "./ShowTopAiringAnime";

export type Anime = {
  title_english: string;
  title: string;
  episodes: number;
  score: number;
  trailer: {
    embed_url: string;
  };
  airing: boolean;
  rating: string;
  synopsis: string;
};

const SearchAnime = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [detail, openDetail] = useState(false);

  return (
    <div className="mt-20 max-w-[1400px] m-auto">
      <ShowTopAiringAnime
        openDetail={openDetail}
        selectedAnime={selectedAnime}
        setSelectedAnime={setSelectedAnime}
      />

      <ShowAnimeDetail
        detail={detail}
        openDetail={openDetail}
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default SearchAnime;
