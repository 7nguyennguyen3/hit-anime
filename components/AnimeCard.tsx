import Image from "next/image";
import { MotionDiv } from "./MotionDiv";
import Link from "next/link";

const variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const AnimeCard = ({ anime, index }: any) => {
  if (!anime || !anime.image || !anime.name) {
    return null; // or some fallback UI
  }

  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <MotionDiv
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: index * 0.2,
          ease: "easeInOut",
          duration: 0.5,
        }}
        viewport={{ once: true }}
        className="max-w-sm rounded w-full"
      >
        <div className="flex flex-col">
          <div className="relative w-[210px] h-[300px] mx-auto">
            <Image
              src={`https://shikimori.one${anime.image.original}`}
              alt={anime.name}
              fill
              sizes="(max-width: 400px) 100vw, 400px"
              quality={100}
              className="rounded-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex justify-center my-3 items-center text-lg">
            {anime.name}
          </div>
        </div>
      </MotionDiv>
    </Link>
  );
};

export default AnimeCard;
