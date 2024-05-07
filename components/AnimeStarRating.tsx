import { FaStar } from "react-icons/fa";

const AnimeStarRating = ({ anime }: { anime: any }) => {
  return (
    <div
      className="w-[60px] h-[30px] bg-white opacity-90 text-black absolute 
          top-0 left-0 flex items-center rounded-lg"
    >
      <div className="flex items-center justify-center align-middle px-1 gap-1">
        <FaStar className="text-yellow-500 text-lg" />
        <text className="text-sm font-semibold">{anime.score}</text>
      </div>
    </div>
  );
};

export default AnimeStarRating;
