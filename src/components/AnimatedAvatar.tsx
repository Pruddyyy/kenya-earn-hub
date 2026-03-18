import { motion } from "framer-motion";

interface AnimatedAvatarProps {
  gender: "male" | "female";
  isWaving?: boolean;
  isTalking?: boolean;
  size?: number;
}

const AnimatedAvatar = ({ gender, isWaving = false, isTalking = false, size = 96 }: AnimatedAvatarProps) => {
  const isMale = gender === "male";

  // Color palette
  const skinTone = isMale ? "#D4A574" : "#E8B89D";
  const skinDark = isMale ? "#C4956A" : "#D9A88D";
  const hairColor = isMale ? "#2C1810" : "#1A0A05";
  const shirtColor = isMale ? "hsl(160, 84%, 30%)" : "hsl(280, 60%, 45%)";
  const shirtLight = isMale ? "hsl(160, 84%, 40%)" : "hsl(280, 60%, 55%)";
  const pantsColor = isMale ? "#2D3748" : "#4A5568";
  const eyeColor = isMale ? "#2C1810" : "#1A0A05";

  const scale = size / 96;

  return (
    <svg
      width={size}
      height={size * 1.17}
      viewBox="0 0 96 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* === LEGS (stationary base) === */}
      <g>
        {/* Left leg */}
        <motion.g
          animate={{ rotate: [0, -4, 0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ originX: "38px", originY: "88px" }}
        >
          <rect x="34" y="88" width="10" height="18" rx="4" fill={pantsColor} />
          {/* Shoe */}
          <ellipse cx="39" cy="107" rx="7" ry="4" fill="#4A3728" />
        </motion.g>
        {/* Right leg */}
        <motion.g
          animate={{ rotate: [0, 4, 0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ originX: "58px", originY: "88px" }}
        >
          <rect x="52" y="88" width="10" height="18" rx="4" fill={pantsColor} />
          {/* Shoe */}
          <ellipse cx="57" cy="107" rx="7" ry="4" fill="#4A3728" />
        </motion.g>
      </g>

      {/* === BODY (gentle sway) === */}
      <motion.g
        animate={{
          rotate: [0, -1.5, 0, 1.5, 0],
          y: [0, -1, 0, -1, 0],
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ originX: "48px", originY: "90px" }}
      >
        {/* Torso / shirt */}
        <rect x="30" y="58" width="36" height="32" rx="8" fill={shirtColor} />
        {/* Shirt collar */}
        <path d="M42 58 L48 64 L54 58" stroke={shirtLight} strokeWidth="2" fill="none" />
        {/* Shirt detail */}
        {isMale ? (
          <rect x="44" y="66" width="8" height="2" rx="1" fill={shirtLight} opacity="0.6" />
        ) : (
          <>
            <circle cx="41" cy="70" r="1.5" fill={shirtLight} opacity="0.6" />
            <circle cx="41" cy="76" r="1.5" fill={shirtLight} opacity="0.6" />
          </>
        )}

        {/* === LEFT ARM === */}
        <motion.g
          animate={
            isWaving
              ? {
                  rotate: [-10, -160, -140, -160, -140, -10],
                }
              : {
                  rotate: [-5, 8, -5],
                }
          }
          transition={
            isWaving
              ? { duration: 1.5, ease: "easeInOut" }
              : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          }
          style={{ originX: "28px", originY: "62px" }}
        >
          {/* Upper arm */}
          <rect x="18" y="58" width="12" height="20" rx="6" fill={shirtColor} />
          {/* Hand */}
          <motion.g
            animate={isWaving ? { rotate: [0, 20, -20, 20, -20, 0] } : {}}
            transition={isWaving ? { duration: 1.5, ease: "easeInOut" } : {}}
            style={{ originX: "24px", originY: "78px" }}
          >
            <circle cx="24" cy="80" r="5" fill={skinTone} />
            {/* Fingers when waving */}
            {isWaving && (
              <g>
                <rect x="20" y="74" width="2" height="4" rx="1" fill={skinTone} />
                <rect x="23" y="73" width="2" height="5" rx="1" fill={skinTone} />
                <rect x="26" y="74" width="2" height="4" rx="1" fill={skinTone} />
              </g>
            )}
          </motion.g>
        </motion.g>

        {/* === RIGHT ARM === */}
        <motion.g
          animate={{ rotate: [5, -8, 5] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          style={{ originX: "68px", originY: "62px" }}
        >
          {/* Upper arm */}
          <rect x="66" y="58" width="12" height="20" rx="6" fill={shirtColor} />
          {/* Hand */}
          <circle cx="72" cy="80" r="5" fill={skinTone} />
        </motion.g>

        {/* === HEAD === */}
        <motion.g
          animate={{
            rotate: [0, -3, 0, 3, 0],
            y: [0, -1, 0, -1, 0],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ originX: "48px", originY: "56px" }}
        >
          {/* Neck */}
          <rect x="43" y="50" width="10" height="10" rx="3" fill={skinTone} />

          {/* Head shape */}
          <ellipse cx="48" cy="38" rx="18" ry="20" fill={skinTone} />

          {/* Hair */}
          {isMale ? (
            <g>
              {/* Short hair */}
              <ellipse cx="48" cy="28" rx="19" ry="14" fill={hairColor} />
              <rect x="29" y="28" width="38" height="6" rx="3" fill={hairColor} />
            </g>
          ) : (
            <g>
              {/* Long hair */}
              <ellipse cx="48" cy="26" rx="20" ry="14" fill={hairColor} />
              <rect x="28" y="26" width="8" height="30" rx="4" fill={hairColor} />
              <rect x="60" y="26" width="8" height="30" rx="4" fill={hairColor} />
              {/* Bangs */}
              <path d="M32 30 Q40 22 48 28 Q56 22 64 30" fill={hairColor} />
            </g>
          )}

          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
            style={{ originX: "48px", originY: "38px" }}
          >
            <ellipse cx="40" cy="38" rx="2.5" ry="3" fill={eyeColor} />
            <ellipse cx="56" cy="38" rx="2.5" ry="3" fill={eyeColor} />
            {/* Eye shine */}
            <circle cx="41" cy="37" r="1" fill="white" />
            <circle cx="57" cy="37" r="1" fill="white" />
          </motion.g>

          {/* Eyebrows */}
          <motion.g
            animate={isWaving ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <rect x="36" y="32" width="8" height="2" rx="1" fill={hairColor} opacity="0.7" />
            <rect x="52" y="32" width="8" height="2" rx="1" fill={hairColor} opacity="0.7" />
          </motion.g>

          {/* Mouth */}
          <motion.g
            animate={
              isTalking
                ? { scaleY: [1, 1.8, 0.6, 1.5, 1, 1.6, 0.8, 1], scaleX: [1, 0.8, 1.2, 0.9, 1.1, 0.85, 1] }
                : { scaleY: 1, scaleX: 1 }
            }
            transition={isTalking ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" } : {}}
            style={{ originX: "48px", originY: "46px" }}
          >
            <ellipse cx="48" cy="46" rx="4" ry="2.5" fill="#C0392B" />
            <ellipse cx="48" cy="45.5" rx="3" ry="1" fill="white" opacity="0.6" />
          </motion.g>

          {/* Cheek blush */}
          <circle cx="34" cy="43" r="3" fill="#FFB6C1" opacity="0.35" />
          <circle cx="62" cy="43" r="3" fill="#FFB6C1" opacity="0.35" />

          {/* Ears */}
          <ellipse cx="30" cy="38" rx="3" ry="4" fill={skinDark} />
          <ellipse cx="66" cy="38" rx="3" ry="4" fill={skinDark} />
        </motion.g>
      </motion.g>
    </svg>
  );
};

export default AnimatedAvatar;
