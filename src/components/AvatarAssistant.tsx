import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import AnimatedAvatar from "@/components/AnimatedAvatar";

const avatarResponses: Record<string, string> = {
  "easy jobs": "I'd recommend starting with Remotasks or Swagbucks — they're beginner-friendly and accept workers from Kenya! 🎉",
  "mpesa": "Jobs on Upwork and Fiverr support M-Pesa withdrawals through Payoneer. I've highlighted M-Pesa compatible jobs in the listings!",
  "scam": "Use the legitimacy checker at the top of the page! Paste any URL and I'll help verify if it's safe. 🛡️",
  "virtual assistant": "Check out Belay and Time Etc for VA jobs. They hire remote assistants and pay $10–15/hr!",
  default: "I'm here to help you find legit online jobs in Kenya! Try asking about easy jobs, M-Pesa payments, or how to spot scams. 😊",
};

type Gender = "male" | "female";

const AvatarAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gender, setGender] = useState<Gender | null>(() => {
    const saved = localStorage.getItem("teemz-gender");
    return saved === "male" || saved === "female" ? saved : null;
  });
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Habari! 👋 I'm Teemz, your job-finding assistant. Ask me anything about online jobs in Kenya!" },
  ]);
  const [input, setInput] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    localStorage.setItem("teemz-gender", g);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = avatarResponses.default;
      for (const [key, val] of Object.entries(avatarResponses)) {
        if (key !== "default" && lower.includes(key)) {
          response = val;
          break;
        }
      }
      setIsTalking(true);
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
      setTimeout(() => setIsTalking(false), 2000);
    }, 800);
  };

  const showGenderPicker = isOpen && !gender;

  // Speech bubble state
  const [speechBubble, setSpeechBubble] = useState<string | null>("Habari! 👋");
  const [isWaving, setIsWaving] = useState(false);

  // Periodic speech bubbles & waving
  useState(() => {
    const greetings = [
      "Habari! 👋",
      "Need a job? Ask me!",
      "Hey there! 😊",
      "I can help! 💼",
      "Tap me! 🤗",
      "Karibu! 🇰🇪",
    ];
    let idx = 0;

    const interval = setInterval(() => {
      if (!isOpen) {
        // Wave animation
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1500);

        // Show speech bubble
        idx = (idx + 1) % greetings.length;
        setSpeechBubble(greetings[idx]);
        setTimeout(() => setSpeechBubble(null), 3500);
      }
    }, 8000);

    // Show initial greeting
    setTimeout(() => setSpeechBubble(null), 4000);

    return () => clearInterval(interval);
  });

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-36 right-0 w-80 bg-card rounded-2xl card-shadow overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="hero-gradient p-4 flex items-center gap-3">
              <img src={avatarImg} alt="Teemz assistant" className="w-10 h-10 rounded-full bg-card object-cover" />
              <div className="flex-1">
                <p className="font-chat font-bold text-primary-foreground text-sm">Teemz</p>
                <p className="text-primary-foreground/70 text-xs font-chat">Your Job Assistant</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {showGenderPicker ? (
              <div className="p-6 text-center space-y-4">
                <p className="font-chat font-bold text-foreground text-sm">Choose your Teemz!</p>
                <p className="text-xs text-muted-foreground font-chat">Pick the avatar you'd like to chat with</p>
                <div className="flex justify-center gap-8 pt-2">
                  {[
                    { g: "male" as Gender, img: avatarMale, label: "Teemz" },
                    { g: "female" as Gender, img: avatarFemale, label: "Teemz" },
                  ].map(({ g, img, label }) => (
                    <button
                      key={g}
                      onClick={() => handleGenderSelect(g)}
                      className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <div className="w-24 h-28 overflow-hidden drop-shadow-lg group-hover:drop-shadow-2xl transition-all">
                        <img src={img} alt={`${label} ${g}`} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-chat font-semibold text-muted-foreground group-hover:text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-3 space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm font-chat ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Teemz about jobs..."
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-chat text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gaming-style Avatar with speech & wave */}
      <div style={{ perspective: "800px" }} className="relative">
        {/* Speech bubble */}
        <AnimatePresence>
          {speechBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
            >
              <div className="bg-card text-foreground text-xs font-chat font-semibold px-3 py-1.5 rounded-xl card-shadow border border-border relative">
                {speechBubble}
                {/* Triangle pointer */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name tag */}
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{ opacity: speechBubble && !isOpen ? 0 : [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="bg-primary/90 text-primary-foreground text-[10px] font-chat font-bold px-2 py-0.5 rounded-full shadow-lg">
            Teemz
          </span>
        </motion.div>

        {/* Drop shadow on ground */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-foreground/10 rounded-full blur-sm"
          animate={
            isOpen
              ? { scaleX: 1, opacity: 0.3 }
              : { scaleX: [1, 0.8, 1.1, 0.85, 1], opacity: [0.3, 0.2, 0.35, 0.2, 0.3] }
          }
          transition={isOpen ? { duration: 0.3 } : { repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-24 h-28 overflow-visible bg-transparent border-none cursor-pointer relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            isOpen
              ? { x: 0, y: 0, rotateY: 0, rotateZ: 0, scale: 1 }
              : isWaving
              ? {
                  rotateZ: [0, -15, 12, -15, 12, -8, 0],
                  y: [0, -10, -6, -10, -6, -3, 0],
                  scale: [1, 1.08, 1.05, 1.08, 1.05, 1.02, 1],
                }
              : {
                  x: [0, -20, 12, -28, 18, 0],
                  y: [0, -8, -18, -4, -14, 0],
                  rotateY: [0, -12, 8, -15, 6, 0],
                  rotateZ: [0, -3, 2, -2, 3, 0],
                  scale: [1, 1.03, 0.98, 1.05, 0.97, 1],
                }
          }
          transition={
            isOpen
              ? { duration: 0.3 }
              : isWaving
              ? { duration: 1.5, ease: "easeInOut" }
              : { repeat: Infinity, duration: 10, ease: "easeInOut" }
          }
          whileHover={{
            scale: 1.12,
            rotateY: 10,
            y: -6,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.92 }}
        >
          <img
            src={avatarImg}
            alt="Teemz assistant"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default AvatarAssistant;
