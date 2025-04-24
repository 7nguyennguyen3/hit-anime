import React from "react";
import classNames from "classnames";

export type Status = "airing" | "complete" | "upcoming";

export interface StatusPickerProps {
  status: Status;
  setStatus: (newStatus: Status) => void;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: "airing", label: "Airing" },
  { value: "complete", label: "Complete" },
  { value: "upcoming", label: "Upcoming" },
];

const StatusPicker: React.FC<StatusPickerProps> = ({ setStatus, status }) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="status-picker-group"
        className="font-medium text-gray-300 text-sm"
      >
        Status
      </label>
      <div id="status-picker-group" className="flex" role="group">
        {statusOptions.map((option, index) => {
          const isSelected = status === option.value;
          const isFirst = index === 0;
          const isLast = index === statusOptions.length - 1;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={classNames(
                "px-4 py-2 text-sm font-medium border border-gray-600 transition-colors duration-150 ease-in-out focus:outline-none z-0",
                "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800",
                {
                  "rounded-l-md": isFirst,
                  "rounded-r-md": isLast,
                  "-ml-px": !isFirst,
                  "bg-blue-600 text-white border-blue-500 hover:bg-blue-700 z-10":
                    isSelected,
                  "bg-gray-700 text-gray-300 hover:bg-gray-600": !isSelected,
                }
              )}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusPicker;
