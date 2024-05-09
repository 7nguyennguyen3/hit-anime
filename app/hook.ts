import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export const useSlidesPerView = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);

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

  return slidesPerView;
};

export const useScrollTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);

  return showScrollTop;
};

const animeIds = [52588, 58080, 53446, 51009, 18689, 48895];

export const useFetchAnimeByIds = () => {
  return useQuery({
    queryKey: ["anime", animeIds],
    queryFn: async () => {
      const animePromises = animeIds.map((id) =>
        axios.get(`https://api.jikan.moe/v4/anime/${id}`)
      );
      const responses = await Promise.all(animePromises);
      return responses.map((res) => res.data.data);
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};

export const useFetchTopAiringAnime = () => {
  return useQuery({
    queryKey: ["topAiringAnime"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.jikan.moe/v4/top/anime?filter=airing&page=1&sfw`
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
};
