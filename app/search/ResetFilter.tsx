interface ResetFilterProps {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
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
      className="border rounded-lg p-2 self-start w-full max-w-[160px]"
      onClick={resetFilters}
    >
      Reset Filter
    </button>
  );
};

export default ResetFilter;
