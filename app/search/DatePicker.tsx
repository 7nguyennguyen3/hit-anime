"use client";

import React, { useState, useMemo } from "react"; // Import React and hooks
import { genresId } from "@/components/data"; // Assuming this data exists
import classNames from "classnames";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaFilter } from "react-icons/fa"; // Import icons
import { motion, AnimatePresence } from "framer-motion"; // For animations

// Define the props, ensuring 'genres' is typed correctly if possible (e.g., Set<number>)
interface DatePickerProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  addGenre: (genreId: number) => void;
  removeGenre: (genreId: number) => void;
  genres: Set<number>; // Assuming genres is a Set of numbers
  startDate: string; // Add for controlled input
  endDate: string; // Add for controlled input
}

// Sort genres alphabetically once
const sortedGenres = [...genresId].sort((a, b) =>
  a.genre.localeCompare(b.genre)
);

const DatePicker: React.FC<DatePickerProps> = ({
  setEndDate,
  setStartDate,
  addGenre,
  removeGenre,
  genres, // Now correctly typed as Set<number>
  startDate,
  endDate,
}) => {
  // State for modal visibility
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  // State for search term within the modal
  const [genreSearchTerm, setGenreSearchTerm] = useState("");

  // Memoize the filtered list of genres for performance
  const filteredGenresForModal = useMemo(() => {
    if (!genreSearchTerm) {
      return sortedGenres;
    }
    return sortedGenres.filter((genre) =>
      genre.genre.toLowerCase().includes(genreSearchTerm.toLowerCase())
    );
  }, [genreSearchTerm]); // Only recompute when search term changes

  // Handlers for modal
  const openGenreModal = () => setIsGenreModalOpen(true);
  const closeGenreModal = () => {
    setIsGenreModalOpen(false);
    setGenreSearchTerm(""); // Reset search on close
  };

  // Validate genres prop on initial render (optional safeguard)
  if (!(genres instanceof Set)) {
    console.error("DatePicker: 'genres' prop must be an instance of Set.");
    // Handle the error appropriately, maybe return null or show an error message
    // For now, let's default to an empty set to prevent crashes, but log the error.
    genres = new Set<number>();
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Date Inputs Row */}
        <div className="flex flex-col gap-4">
          {/* Start Date */}
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-medium text-gray-300">
              Start Date:
            </span>
            <input
              className="p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </label>
          {/* End Date */}
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-medium text-gray-300">End Date:</span>
            <input
              className="p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </label>
        </div>

        {/* More Genres Button */}
        <div className="self-start">
          <button
            onClick={openGenreModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-md transition-colors text-sm"
          >
            <FaFilter />
            Select Genres ({genres?.size ?? 0}) {/* Display count */}
          </button>
        </div>
      </div>

      {/* Genre Selection Modal */}
      <AnimatePresence>
        {isGenreModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99] 
            flex items-center justify-center p-4"
            onClick={closeGenreModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.2,
              }}
              className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-700"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-lg font-semibold text-white">
                  Select Genres
                </h2>
                <button
                  onClick={closeGenreModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search genres..."
                    value={genreSearchTerm}
                    onChange={(e) => setGenreSearchTerm(e.target.value)}
                    className="w-full p-2 pl-9 pr-4 text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search genres"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Modal Genre List */}
              <div className="p-4 overflow-y-auto flex-grow">
                {/* Add check for genres being a Set */}
                {!(genres instanceof Set) ? (
                  <p className="text-red-400 text-center">
                    Error: Invalid genre data.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredGenresForModal.map((genre) => {
                      const isSelected = genres.has(genre.id);
                      return (
                        <label
                          key={genre.id}
                          className={classNames(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors duration-150 border",
                            {
                              "bg-blue-600/30 border-blue-500/50 text-blue-100 hover:bg-blue-600/40":
                                isSelected,
                              "bg-gray-700/60 border-gray-600/80 text-gray-300 hover:bg-gray-600/80":
                                !isSelected,
                            }
                          )}
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) removeGenre(genre.id);
                              else addGenre(genre.id);
                            }}
                            aria-labelledby={`genre-label-${genre.id}`} // Accessibility
                          />
                          <span
                            id={`genre-label-${genre.id}`}
                            className="text-sm select-none line-clamp-1"
                          >
                            {genre.genre}
                          </span>
                        </label>
                      );
                    })}
                    {filteredGenresForModal.length === 0 && (
                      <p className="col-span-full text-center text-gray-500 py-4">
                        No genres match your search.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-gray-700 text-right flex-shrink-0">
                <button
                  onClick={closeGenreModal}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DatePicker;
