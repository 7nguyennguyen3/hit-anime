import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { CgPlayButtonO } from "react-icons/cg";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoMdSwitch } from "react-icons/io";
import { IoClose, IoInformationCircle } from "react-icons/io5";

interface Props {
  detail: any;
  selectedAnime: any;
  openDetail: any;
}

const ShowAnimeDetail = ({ detail, selectedAnime, openDetail }: Props) => {
  const [showTrailer, setShowTrailer] = useState(true);
  const [openPopover, setOpenPopover] = useState(false);
  const [showEnglishTitle, setShowEnglishTitle] = useState(true);

  return (
    <>
      {detail && selectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="h-[100vh] w-[90vw] max-w-[800px] xxs:max-h-[600px] xs:max-h-[700px] bg-slate-500 opacity-[96%] 
          rounded z-20 relative flex flex-col items-center align-middle overflow-y-scroll scrollbar-hide"
          >
            <button
              onClick={() => {
                openDetail(false);
                setShowTrailer(true);
                setShowEnglishTitle(true);
              }}
              className="absolute top-5 right-5 text-black z-30"
            >
              <IoClose size={30} />
            </button>
            <div className="flex flex-col p-5 gap-3 w-full mt-10">
              <div className="flex font-semibold text-[13px]">
                <div
                  className={classNames(
                    "w-[80px] h-[40px] items-center flex border-pop-out rounded-l-full justify-center cursor-pointer",
                    {
                      "bg-green-800 scale-105": showEnglishTitle,
                    }
                  )}
                  onClick={() => setShowEnglishTitle(true)}
                >
                  English
                </div>
                <div
                  className={classNames(
                    "w-[80px] h-[40px] items-center flex border-pop-out rounded-r-full justify-center cursor-pointer",
                    {
                      "bg-green-800 scale-105": !showEnglishTitle,
                    }
                  )}
                  onClick={() => setShowEnglishTitle(false)}
                >
                  Japanese
                </div>
              </div>
              <text className="text-lg">
                <strong>Title:</strong>{" "}
                {showEnglishTitle
                  ? selectedAnime.title_english || selectedAnime.title
                  : selectedAnime.title}
              </text>

              <text className="text-lg">
                <strong>Episode:</strong>{" "}
                {selectedAnime.episodes === null
                  ? "Not Yet Determined"
                  : selectedAnime.episodes}
              </text>
              <text className="text-lg">
                <strong>Score⭐:</strong> {selectedAnime.score}
              </text>
              <text className="text-lg">
                <strong>Rating:</strong> {selectedAnime.rating}
              </text>
              <text className="text-lg">
                <strong>Airing:</strong>{" "}
                {selectedAnime.airing === true
                  ? "Currently Airing"
                  : "Finished"}
              </text>
              <text className="text-lg">
                <strong>Genres:</strong>{" "}
                {selectedAnime.genres.map((genre: any, index: any) => (
                  <span key={index}>
                    {genre.name}
                    {index < selectedAnime.genres.length - 1 ? ", " : ""}
                  </span>
                ))}
              </text>
              <div className="flex items-center gap-2 text-lg xxs:flex-col xs:flex-row">
                <button
                  className="border-orange-pop-out self-start p-2 rounded-lg font-bold red-orange-gradient"
                  onClick={() => setShowTrailer(!showTrailer)}
                >
                  {!showTrailer ? "Show Trailer" : "Show Description"}
                </button>

                <div className="flex items-center self-start gap-2">
                  <a
                    href={`https://hianime.to/search?keyword=${
                      selectedAnime.title_english
                        ? selectedAnime.title_english
                        : selectedAnime.title
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-blue-pop-out self-start p-2 rounded-lg blue-sky-gradient font-bold"
                  >
                    Watch on HiAnime
                  </a>
                  <button
                    className="p-2 relative"
                    onMouseEnter={() => setOpenPopover(true)}
                    onMouseLeave={() => setOpenPopover(false)}
                    onClick={() => setOpenPopover(!openPopover)}
                  >
                    <IoInformationCircle className="text-[24px]" />
                    {openPopover && (
                      <div
                        className="w-[160px] h-[60px] bg-white absolute top-10 right-0 
                      opacity-90 rounded-lg flex justify-center items-center"
                      >
                        <text className="z-10 text-black text-sm font-medium p-2">
                          Redirect you to HiAnime when clicked.
                        </text>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {!showTrailer ? (
                <div className="w-full h-[300px] flex border rounded-lg p-5 overflow-y-scroll">
                  <div className="flex flex-col w-full">
                    <text className="font-bold text-lg my-3">Description:</text>
                    {selectedAnime.synopsis}
                  </div>
                </div>
              ) : (
                <>
                  {selectedAnime.trailer.embed_url === null ? (
                    <div className="w-full h-[300px] flex items-center justify-center border">
                      Video Unavailable
                    </div>
                  ) : (
                    <div
                      className="w-full h-[300px] flex items-center justify-center border bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url(${selectedAnime.trailer.images.large_image_url})`,
                        backgroundPosition: "center",
                      }}
                      onClick={() => {
                        const newWindow = window.open(
                          selectedAnime.trailer.url,
                          "_blank"
                        );
                        if (newWindow) newWindow.opener = null;
                      }}
                    >
                      <CgPlayButtonO className="text-[60px] text-red-400 hover:cursor-pointer" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowAnimeDetail;
