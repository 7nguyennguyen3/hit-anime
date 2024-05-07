"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

const navLinks = [
  { label: "Link", href: "/" },
  { label: "Link", href: "/" },
  { label: "Link", href: "/" },
  { label: "Link", href: "/" },
];

const Navbar = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  return (
    <div
      className="border mx-auto
  flex items-center gap-3 p-3 max-w-[1400px] justify-between
  "
    >
      <Link href="/">Logo</Link>
      <div className="flex items-center gap-3 w-[70%] justify-center">
        <form
          className="flex items-center w-[100%] max-w-[600px] gap-3 relative"
          onSubmit={() => {
            event?.preventDefault();
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
      <button>
        <FiMenu className="text-[40px]" />
      </button>
      {/* <div className="space-x-3">
        {navLinks.map((link) => (
          <Link href={link.href} className="hover:text-blue-500">
            {link.label}
          </Link>
        ))}
      </div> */}
    </div>
  );
};

export default Navbar;
