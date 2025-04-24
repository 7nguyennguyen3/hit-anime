import classNames from "classnames";
import { useState } from "react";
import { CgPlayButtonO } from "react-icons/cg";
import { IoClose, IoInformationCircle } from "react-icons/io5";

// Props definition remains the same as your original request's structure
interface Props {
  detail: any;
  selectedAnime: any;
  openDetail: any;
}

// --- Visually Improved Component (Scrollbar Hidden) ---
const ShowAnimeDetail = ({ detail, selectedAnime, openDetail }: Props) => {
  // State variables remain exactly as in your original code
  const [showTrailer, setShowTrailer] = useState(true);
  const [openPopover, setOpenPopover] = useState(false);
  const [showEnglishTitle, setShowEnglishTitle] = useState(true);

  // Conditional rendering based on original props
  if (!detail || !selectedAnime) {
    return null;
  }

  return (
    // Modal Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      {/* Modal Content Container - Keeping fixed max-height */}
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden
                   rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl ring-1 ring-white/10
                   max-h-[750px]"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            openDetail(false);
            setShowTrailer(true);
            setShowEnglishTitle(true);
            setOpenPopover(false);
          }}
          className="absolute right-4 top-4 z-30 rounded-full p-1.5 text-slate-400 transition
                     hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Close details"
        >
          <IoClose size={24} />
        </button>

        {/* Scrollable Content Area - Added 'scrollbar-hide', removed scrollbar styling classes */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {/* Title Switch (Using pop-out border for active state) */}
          <div className="mb-5 inline-flex rounded-md bg-slate-700/50 p-1 text-sm shadow-sm">
            <button
              onClick={() => setShowEnglishTitle(true)}
              className={classNames(
                "rounded px-4 py-1.5 font-medium transition relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                {
                  "border-b-4 border-r-4 border-b-sky-600 border-r-sky-600 bg-slate-700 text-white shadow":
                    showEnglishTitle,
                  "border-b-4 border-r-4 border-transparent text-slate-300 hover:bg-slate-600/50 hover:text-slate-100":
                    !showEnglishTitle,
                }
              )}
            >
              English
            </button>
            <button
              onClick={() => setShowEnglishTitle(false)}
              className={classNames(
                "rounded px-4 py-1.5 font-medium transition relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                {
                  "border-b-4 border-r-4 border-b-sky-600 border-r-sky-600 bg-slate-700 text-white shadow":
                    !showEnglishTitle,
                  "border-b-4 border-r-4 border-transparent text-slate-300 hover:bg-slate-600/50 hover:text-slate-100":
                    showEnglishTitle,
                }
              )}
            >
              Japanese
            </button>
          </div>

          {/* Main Details Section */}
          <div className="mb-6 space-y-3">
            <h2 className="text-2xl font-bold text-white">
              {showEnglishTitle
                ? selectedAnime.title_english || selectedAnime.title
                : selectedAnime.title}
            </h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
              {/* Details remain the same */}
              <div>
                <span className="font-semibold text-slate-100">Episodes:</span>
                <span className="ml-2 text-slate-300">
                  {selectedAnime.episodes ?? "TBD"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-100">Score:</span>
                <span className="ml-2 text-slate-300">
                  {selectedAnime.score
                    ? `⭐ ${selectedAnime.score.toFixed(1)}`
                    : "N/A"}
                </span>
              </div>
              {/* Rating - Check if long text causes issues here */}
              <div>
                <span className="font-semibold text-slate-100">Rating:</span>
                {/* Consider adding 'truncate' here if needed as an alternative */}
                <span className="ml-2 text-slate-300">
                  {selectedAnime.rating || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-100">Status:</span>
                <span className="ml-2 text-slate-300">
                  {selectedAnime.airing ? "Airing" : "Finished"}
                </span>
              </div>
              <div className="col-span-2 md:col-span-3">
                <span className="font-semibold text-slate-100">Genres:</span>
                <span className="ml-2 text-slate-300">
                  {selectedAnime.genres
                    ?.map((genre: any) => genre.name)
                    .join(", ") || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Info (Using original gradient/pop-out style) */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {/* Toggle Button */}
            <button
              className={classNames(
                "border-orange-pop-out rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              )}
              onClick={() => setShowTrailer(!showTrailer)}
            >
              <span className="red-orange-gradient">
                {!showTrailer ? "Show Trailer" : "Show Description"}
              </span>
            </button>

            {/* Watch Link & Info Button Group */}
            <div className="relative flex items-center gap-2">
              {/* Watch Button */}
              <a
                href={`https://hianime.to/search?keyword=${encodeURIComponent(
                  selectedAnime.title_english || selectedAnime.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  "border-blue-pop-out rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                )}
              >
                <span className="blue-sky-gradient">Watch on HiAnime</span>
              </a>
              {/* Info Button & Popover */}
              <div className="relative">
                <button
                  className="flex items-center justify-center rounded-full p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  onMouseEnter={() => setOpenPopover(true)}
                  onMouseLeave={() => setOpenPopover(false)}
                  onClick={() => setOpenPopover(!openPopover)}
                  aria-label="Information about HiAnime link"
                >
                  <IoInformationCircle size={20} />
                </button>
                {openPopover && (
                  <div className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-slate-950 px-3 py-2 text-center text-xs font-medium text-white shadow-lg ring-1 ring-white/10">
                    Redirects you to HiAnime when clicked.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Content Area: Trailer or Synopsis */}
          {/* Description view inside this container might also need scrollbar-hide if it scrolls independently */}
          <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
            {!showTrailer ? (
              // Description View - Added scrollbar-hide here too, just in case
              <div className="max-h-[300px] overflow-y-auto p-5 scrollbar-hide">
                <h3 className="mb-2 text-lg font-semibold text-slate-100">
                  Description
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {selectedAnime.synopsis || "No synopsis available."}
                </p>
              </div>
            ) : (
              // Trailer View
              <>
                {selectedAnime.trailer?.embed_url ? (
                  // Clickable Thumbnail
                  <div
                    className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
                    style={{
                      backgroundImage: `url(${
                        selectedAnime.trailer.images?.large_image_url ||
                        selectedAnime.trailer.images?.maximum_image_url ||
                        ""
                      })`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    onClick={() => {
                      const newWindow = window.open(
                        selectedAnime.trailer.url,
                        "_blank"
                      );
                      if (newWindow) newWindow.opener = null;
                    }}
                    aria-label="Play trailer"
                  >
                    {/* Overlay and Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100">
                      <CgPlayButtonO className="text-6xl text-blue-400 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                ) : (
                  // Trailer Unavailable
                  <div className="flex aspect-video w-full items-center justify-center rounded bg-slate-700/50 text-base font-semibold text-slate-400">
                    Trailer Unavailable
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAnimeDetail;
