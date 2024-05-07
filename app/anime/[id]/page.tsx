"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAnimeDetail } from "@/components/action";

const AnimeDetailPage = () => {
  const params = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const animeId = params.id;
    if (animeId) {
      fetchAnimeDetail(animeId).then(setData);
    }
  }, [params.id]); // Dependency array with params.id to avoid re-fetching if the id hasn't changed

  if (!data) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};

export default AnimeDetailPage;
