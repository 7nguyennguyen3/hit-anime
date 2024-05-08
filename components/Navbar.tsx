"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
];

const Navbar = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      className="mx-auto
  flex items-center gap-3 p-3 max-w-[1400px] justify-between mb-10
  "
    >
      <Link href="/">
        <Image src="/logo.png" alt="Logo Image" width={150} height={100} />
      </Link>
      <div className="flex items-center gap-3 w-[70%] justify-center xxs:hidden sm:flex">
        <form
          className="flex items-center w-[100%] max-w-[400px] gap-3 relative"
          onSubmit={(event) => {
            event.preventDefault();
            setOpenMenu(false);
            router.push(`/search/${encodeURIComponent(searchInput)}`);
          }}
        >
          <input
            placeholder="Search for an anime"
            className="p-2 pr-10 text-black rounded-lg w-full"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="absolute z-10 right-2">
            <BiSearch size={25} className="text-black" />
          </button>
        </form>
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
            className="w-[90%] max-w-[400px] h-[500px] bg-slate-900 fixed mx-auto top-14 right-5
            rounded-lg z-50 p-5 flex flex-col gap-5 justify-center items-center"
          >
            <button
              className="absolute top-5 right-5"
              onClick={() => setOpenMenu(false)}
            >
              <IoClose className="text-[30px]" />
            </button>
            <div className="flex items-center gap-3 w-[90%] justify-center xxs:flex sm:hidden">
              <form
                className="flex items-center w-[100%] max-w-[600px] gap-3 relative"
                onSubmit={() => {
                  event?.preventDefault();
                  router.push(`/search/${encodeURIComponent(searchInput)}`);
                }}
              >
                <input
                  placeholder="Search for an anime"
                  className="p-3 pr-10 text-black rounded-lg w-full"
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="absolute z-10 right-2">
                  <BiSearch size={25} className="text-black" />
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link href={link.href}>
                  <button className="border border-b-4 border-r-4 p-3 w-[200px] rounded-lg text-lg font-semibold">
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
