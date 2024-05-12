import { genresId } from "@/components/data";
import classNames from "classnames";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  setStartDate: any;
  setEndDate: any;
  addGenre: (genre: number) => void;
  removeGenre: (genre: number) => void;
  genres: any;
}

const DatePicker = ({
  setEndDate,
  setStartDate,
  addGenre,
  removeGenre,
  genres,
}: Props) => {
  const [showMoreGenres, setShowMoreGenres] = useState(false);

  return (
    <div className="flex gap-5 xxs:flex-col xs:flex-row relative max-w-[500px]">
      <label className="flex flex-col">
        Start Date:
        <input
          className="bg-slate-800 max-w-[160px] p-2 rounded-lg"
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        End Date:
        <input
          className="bg-slate-800 max-w-[160px] p-2 rounded-lg"
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <div className="border flex items-center self-start mt-auto  rounded-lg p-2 max-h-[45px] max-w-[200px]">
        <button
          className="rounded-lg"
          onClick={() => setShowMoreGenres(!showMoreGenres)}
        >
          More Genres
        </button>
      </div>
      {showMoreGenres && (
        <div
          className="absolute w-full h-[500px] xxs:top-[220px] xs:top-20 
        rounded-lg bg-slate-700 grid xxs:grid-cols-2 xs:grid-cols-3 gap-2 pt-16 p-3
        z-10 overflow-y-scroll scrollba"
        >
          <button
            onClick={() => setShowMoreGenres(false)}
            className="absolute top-5 right-5 text-[30px]"
          >
            <IoClose />
          </button>
          {genresId
            .sort((a, b) => a.genre.localeCompare(b.genre))
            .map((genre) => (
              <div
                key={genre.id}
                onClick={() => {
                  if (genres.has(genre.id)) {
                    removeGenre(genre.id);
                  } else {
                    addGenre(genre.id);
                  }
                }}
                className={classNames(
                  "border p-1 px-2 text-[15px] rounded-lg text-clip",
                  {
                    "bg-green-800 border-pop-out": genres.has(genre.id),
                  }
                )}
              >
                {genre.genre}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
