import { IoReload } from "react-icons/io5";
import { Status } from "./StatusPicker";

interface ResetFilterProps {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setGenres: React.Dispatch<React.SetStateAction<Set<number>>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const initialStatus = "complete";
const initialGenres = new Set<number>([]);
const initialStartDate = "";
const initialEndDate = "";
const initialSearchInput = "";

const ResetFilter = ({
  setStatus,
  setGenres,
  setStartDate,
  setEndDate,
  setSearchInput,
}: ResetFilterProps) => {
  const resetFilters = () => {
    setStatus(initialStatus);
    setGenres(initialGenres);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setSearchInput(initialSearchInput);
  };

  return (
    <button
      type="button"
      onClick={resetFilters}
      className="
      w-full  
      mt-2  
      flex items-center justify-center gap-2 
      px-4 py-2 
      bg-gray-600 text-gray-100 
      border border-transparent 
      rounded-lg 
      text-sm font-medium 
      shadow-sm 
      hover:bg-gray-500 
      transition-colors duration-150 ease-in-out 
    "
    >
      <IoReload className="w-4 h-4" aria-hidden="true" />
      <span>Reset Filters</span>
    </button>
  );
};

export default ResetFilter;
