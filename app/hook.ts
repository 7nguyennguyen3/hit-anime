import axios from "axios";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

const animeIds = [28851, 32281, 53446, 199, 4181];

export const useFetchAnimeByIds = () => {
  return useQuery({
    queryKey: ["anime", animeIds],
    queryFn: async () => {
      const responses = [];
      for (const id of animeIds) {
        const response = await axios.get(
          `https://api.jikan.moe/v4/anime/${id}`
        );
        responses.push(response);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

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

export const useFetchSearchAnime = (keyword: string) => {
  return useQuery({
    queryKey: ["searchAnime", keyword],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${keyword}&sfw`
      );

      return response.data.data;
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearchAnime(filter: any) {
  const fetchRecommendedAnime = ({ pageParam }: { pageParam: number }) =>
    axios
      .get(`https://api.jikan.moe/v4/anime?page=${pageParam}`, {
        params: filter,
      })
      .then((res) => res.data);

  return useInfiniteQuery({
    queryKey: [
      "searchAnime",
      filter.status,
      Array.from(filter.genres).join(","),
      filter.order_by,
      filter.start_date,
      filter.end_date,
      filter.q,
    ],
    queryFn: fetchRecommendedAnime,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
  });
}
