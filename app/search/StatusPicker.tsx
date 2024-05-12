import classNames from "classnames";

interface Props {
  status: string;
  setStatus: any;
}

const StatusPicker = ({ setStatus, status }: Props) => {
  return (
    <div className="flex font-semibold">
      <div
        className={classNames(
          "w-[100px] h-[40px] items-center flex border-pop-out rounded-l-full justify-center cursor-pointer",
          {
            "bg-green-800 scale-105": status === "airing",
          }
        )}
        onClick={() => setStatus("airing")}
      >
        Airing
      </div>
      <div
        className={classNames(
          "w-[100px] h-[40px] items-center flex border-pop-out justify-center cursor-pointer",
          {
            "bg-green-800 scale-105": status === "complete",
          }
        )}
        onClick={() => setStatus("complete")}
      >
        Complete
      </div>
      <div
        className={classNames(
          "w-[100px] h-[40px] items-center flex border-pop-out rounded-r-full justify-center cursor-pointer",
          {
            "bg-green-800 scale-105": status === "upcoming",
          }
        )}
        onClick={() => setStatus("upcoming")}
      >
        Upcoming
      </div>
    </div>
  );
};

export default StatusPicker;
