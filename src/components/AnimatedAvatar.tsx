import { motion } from "framer-motion";
import teemzMale from "@/assets/teemz-male.png";
import teemzFemale from "@/assets/teemz-female.png";

interface AnimatedAvatarProps {
  gender: "male" | "female";
  isWaving?: boolean;
  isTalking?: boolean;
  size?: number;
}

const AnimatedAvatar = ({ gender, isWaving = false, isTalking = false, size = 96 }: AnimatedAvatarProps) => {
  const src = gender === "male" ? teemzMale : teemzFemale;

  return (
    <motion.div
      style={{ width: size, height: size * 1.17 }}
      className="relative"
      animate={
        isTalking
          ? { scale: [1, 1.03, 0.98, 1.02, 1], y: [0, -2, 0, -1, 0] }
          : isWaving
          ? { rotate: [0, -8, 6, -8, 6, 0], scale: [1, 1.05, 1.02, 1.05, 1.02, 1] }
          : { y: [0, -3, 0], rotate: [0, -1, 0, 1, 0] }
      }
      transition={
        isTalking
          ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
          : isWaving
          ? { duration: 1.2, ease: "easeInOut" }
          : { repeat: Infinity, duration: 3, ease: "easeInOut" }
      }
    >
      <img
        src={src}
        alt={`Teemz ${gender} fox avatar`}
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </motion.div>
  );
};

export default AnimatedAvatar;
