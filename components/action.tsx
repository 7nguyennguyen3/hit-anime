"use server";

import AnimeCard from "./AnimeCard";

export const fetchAnime = async (page: number) => {
  const response = await fetch(
    `https://shikimori.one/api/animes?page=${page}&limit=12&order=popularity`
  );

  const data = await response.json();

  return data.map((anime: any, index: number) => (
    <AnimeCard key={anime.id} anime={anime} index={index} />
  ));
};

export const fetchAnimeDetail = async (animeId: string | string[]) => {
  const response = await fetch(`https://shikimori.one/api/animes/${animeId}`);

  const data = await response.json();

  return data;
};
