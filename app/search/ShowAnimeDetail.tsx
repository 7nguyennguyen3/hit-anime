import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  detail: any;
  selectedAnime: any;
  openDetail: any;
}

const ShowAnimeDetail = ({ detail, selectedAnime, openDetail }: Props) => {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
      {detail && selectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="h-[100vh] w-[90vw] max-w-[800px] xxs:max-h-[400px] xs:max-h-[700px] bg-slate-500 opacity-[96%] 
          rounded z-20 relative flex flex-col items-center align-middle overflow-y-scroll"
          >
            <button
              onClick={() => {
                openDetail(false);
                setShowTrailer(false);
              }}
              className="absolute top-5 right-5 text-black z-30"
            >
              <IoClose size={30} />
            </button>
            <div className="flex flex-col p-5 gap-3 w-full mt-10">
              <text className="text-lg">
                <strong>Title:</strong>{" "}
                {selectedAnime.title_english === null
                  ? selectedAnime.title
                  : selectedAnime.title_english}
              </text>
              <text className="text-lg">
                <strong>Episode:</strong>{" "}
                {selectedAnime.episodes === null
                  ? "Not Yet Determined"
                  : selectedAnime.episodes}
              </text>
              <text className="text-lg">
                <strong>Rating:</strong> {selectedAnime.score}
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
              <div className="flex items-center gap-2 xxs:text-sm xs:text-lg">
                <button
                  className="border-2 self-start p-2 rounded-lg font-bold text-yellow-400"
                  onClick={() => setShowTrailer(!showTrailer)}
                >
                  {!showTrailer ? "Show Trailer" : "Show Description"}
                </button>
                <Link
                  href={`https://hianime.to/search?keyword=${selectedAnime.title_english}`}
                  className="border-2 self-start p-2 rounded-lg font-bold text-yellow-400"
                >
                  {`Watch on HiAnime`}
                </Link>
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
                    <iframe
                      className="rounded-lg"
                      width="100%"
                      height="300px"
                      src={`${selectedAnime.trailer.embed_url}&autoplay=0`}
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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
