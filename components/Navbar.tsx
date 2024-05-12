"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

import { Anime } from "@/app/browse/page";
import ShowAnimeDetail from "@/app/browse/ShowAnimeDetail";
import { useDebounce, useFetchSearchAnime } from "@/app/hook";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import FetchingAnime from "./layout & common components/FetchingAnime";
import classNames from "classnames";
import { FaRegQuestionCircle } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Cosmic Search", href: "/search" },
];

const Navbar = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [autoClose, setAutoClose] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const [detail, openDetail] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const debouncedSearchInput = useDebounce(searchInput, 1000);
  const { data: searchAnime, isLoading } =
    useFetchSearchAnime(debouncedSearchInput);

  const searchBarForm = (
    <form
      className="flex items-center w-[100%] max-w-[600px] gap-3 relative"
      onSubmit={(event) => {
        event.preventDefault();
        setSearchInput("");
        setOpenMenu(false);
        router.push(`/search/${encodeURIComponent(searchInput)}`);
      }}
    >
      <div className="flex xxs:flex-col md:flex-row gap-3 w-full">
        <div className="relative flex items-center xxs:w-full md:w-[80%]">
          <input
            placeholder="Search for an anime"
            className="p-2 pr-10 text-black rounded-lg w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => {
              if (autoClose) {
                setDropdownOpen(false);
              }
            }}
          />
          <button type="submit" className="absolute z-10 right-2">
            <BiSearch size={25} className="text-black" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoClose}
            onChange={() => setAutoClose(!autoClose)}
          />
          <text className="text-[14px] text-nowrap">Auto Close</text>
          <div className="relative text-blue-500 cursor-pointer">
            <FaRegQuestionCircle
              size={20}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                className="z-20 absolute bg-white opacity-90 p-5 rounded-lg top-[25px] left-[-100px]
              w-[200px] text-black font-semibold"
              >
                Turn on to automatically close dropdown when click away.
              </div>
            )}
          </div>
        </div>
      </div>

      {dropdownOpen && searchInput !== "" && (
        <div
          className="absolute w-full max-w-[400px] h-[400px] bg-slate-600 top-12
    rounded-lg p-3 overflow-y-scroll flex flex-col gap-3 z-10 scrollbar-hide"
        >
          {isLoading ? (
            <FetchingAnime />
          ) : (
            searchAnime && (
              <div className="flex flex-col">
                <button
                  className="self-end mb-10"
                  onClick={() => setSearchInput("")}
                >
                  <IoClose className="text-[30px]" />
                </button>
                {searchAnime
                  .filter((anime: any) => anime.score >= 6)
                  .map((anime: any) => (
                    <div key={anime.mal_id} className="flex items-center gap-3">
                      <div
                        className="flex xxs:gap-2 sm:gap-10 items-center xxs:flex-col xs:flex-row w-full 
                  xxs:mb-10 xs:mb-5"
                      >
                        <div
                          key={anime.mal_id}
                          className="relative min-h-[200px] max-w-[140px] w-[100%] hover:scale-105"
                          onMouseDown={() => {
                            openDetail(true);
                            setSelectedAnime(anime);
                          }}
                        >
                          <img
                            src={anime.images.webp.image_url}
                            alt={anime.title_english || "Anime Image"}
                            className="rounded-lg border-pop-out hover:cursor-pointer 
                            w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <text className="text-yellow-400">
                              ⭐ {anime.score}
                            </text>
                            <text className="font-semibold">
                              Ep: {anime.episodes}
                            </text>
                          </div>
                          <text className="text-[13px] font-semibold">
                            {anime.rating}
                          </text>
                          <text
                            className="w-[160px] max-h-[200px] overflow-hidden border-pop-out 
                      rounded-lg self-start p-1"
                          >
                            {anime.title_english
                              ? anime.title_english
                              : anime.title}
                          </text>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      )}
    </form>
  );

  return (
    <div
      className="mx-auto relative
  flex items-center gap-3 p-3 max-w-[1400px] justify-between mb-10
  "
    >
      <Link href="/">
        <Image src="/logo.png" alt="Logo Image" width={150} height={100} />
      </Link>
      <div className="flex items-center gap-3 w-[70%] justify-center xxs:hidden md:flex">
        {searchBarForm}
      </div>
      <div className="hover:scale-110" onClick={() => setOpenMenu(!openMenu)}>
        <FiMenu className="text-[40px]" />
      </div>
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: openMenu ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="w-[90%] max-w-[500px] h-[500px] bg-slate-900 absolute mx-auto top-14 right-5
            rounded-lg z-50 p-5 flex flex-col gap-5 justify-center items-center"
          >
            <button
              className="absolute top-5 right-5"
              onClick={() => setOpenMenu(false)}
            >
              <IoClose className="text-[30px]" />
            </button>
            <div className="flex items-center gap-3 w-[90%] justify-center xxs:flex md:hidden">
              {searchBarForm}
            </div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link href={link.href}>
                  <button
                    onClick={() => setOpenMenu(false)}
                    className={classNames(
                      "border border-b-4 border-r-4 p-3 w-[200px] rounded-lg text-lg font-semibold",
                      {
                        "border-orange-pop-out red-orange-gradient":
                          link.href === "/search",
                      }
                    )}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShowAnimeDetail
        detail={detail}
        openDetail={openDetail}
        selectedAnime={selectedAnime}
      />
    </div>
  );
};

export default Navbar;
