import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        w-full max-w-[1400px] mx-auto
        px-4 sm:px-6 lg:px-8
        py-6 md:py-8
        mt-16
        border-t border-gray-700
      "
    >
      <div
        className="
          flex flex-col sm:flex-row
          items-center
          justify-between
          gap-4
        "
      >
        <p className="text-sm text-gray-400 order-2 sm:order-1">
          &copy; {currentYear} Hit Anime. All Rights Reserved.
        </p>

        <nav
          className="flex flex-wrap justify-center sm:justify-end items-center gap-x-4 gap-y-2 order-1 sm:order-2"
          aria-label="Footer navigation"
        >
          <Link href="/" passHref legacyBehavior>
            <a className="text-sm text-gray-300 hover:text-blue-400 transition-colors duration-150">
              Home
            </a>
          </Link>
          <Link href="/terms" passHref legacyBehavior>
            <a className="text-sm text-gray-300 hover:text-blue-400 transition-colors duration-150">
              Terms
            </a>
          </Link>
          <Link href="/privacy" passHref legacyBehavior>
            <a className="text-sm text-gray-300 hover:text-blue-400 transition-colors duration-150">
              Privacy Policy
            </a>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
