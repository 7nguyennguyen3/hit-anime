import { useState, useEffect } from "react";

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
