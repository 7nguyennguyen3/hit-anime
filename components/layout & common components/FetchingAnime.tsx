import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
const FetchingAnime = () => {
  return (
    <div
      className="w-full h-[300px] flex 
          items-center justify-center rounded-lg gap-3 text-orange-500"
    >
      <motion.div
        animate={{
          y: ["0%", "30%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <text>Fetching Anime...</text>
      </motion.div>
      <motion.div
        animate={{
          rotate: 360,
          y: ["0%", "30%", "0%"],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <ImSpinner3 />
      </motion.div>
    </div>
  );
};

export default FetchingAnime;
