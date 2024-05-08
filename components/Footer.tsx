import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="max-w-[1400px] p-10 mt-20 border-t-2 border-t-blue-400 flex flex-col 
    items-center justify-center gap-3 mx-auto"
    >
      <Link href="/">
        <button className="w-[140px] p-3 rounded-lg border-blue-pop-out flex justify-center hover:scale-110">
          Home
        </button>
      </Link>
      <p className="blue-sky-gradient text-lg font-semibold">
        © 2024 Hit Anime
      </p>
    </div>
  );
};

export default Footer;
