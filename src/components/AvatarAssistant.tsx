import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import avatarMale from "@/assets/avatar-male.png";
import avatarFemale from "@/assets/avatar-female.png";

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
    const saved = localStorage.getItem("kazi-gender");
    return saved === "male" || saved === "female" ? saved : null;
  });
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Habari! 👋 I'm Kazi, your job-finding assistant. Ask me anything about online jobs in Kenya!" },
  ]);
  const [input, setInput] = useState("");

  const avatarImg = gender === "female" ? avatarFemale : avatarMale;

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    localStorage.setItem("kazi-gender", g);
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
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
    }, 800);
  };

  const showGenderPicker = isOpen && !gender;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-80 bg-card rounded-2xl card-shadow overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="hero-gradient p-4 flex items-center gap-3">
              <img src={avatarImg} alt="Kazi assistant" className="w-10 h-10 rounded-full bg-card object-cover" />
              <div className="flex-1">
                <p className="font-display font-bold text-primary-foreground text-sm">Kazi</p>
                <p className="text-primary-foreground/70 text-xs font-body">Your Job Assistant</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {showGenderPicker ? (
              /* Gender Picker */
              <div className="p-6 text-center space-y-4">
                <p className="font-display font-bold text-foreground text-sm">Choose your Kazi assistant!</p>
                <p className="text-xs text-muted-foreground font-body">Pick the avatar you'd like to chat with</p>
                <div className="flex justify-center gap-6 pt-2">
                  <button
                    onClick={() => handleGenderSelect("male")}
                    className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary/30 group-hover:border-primary transition-colors">
                      <img src={avatarMale} alt="Male Kazi" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-body font-medium text-muted-foreground group-hover:text-foreground">Kazi</span>
                  </button>
                  <button
                    onClick={() => handleGenderSelect("female")}
                    className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary/30 group-hover:border-primary transition-colors">
                      <img src={avatarFemale} alt="Female Kazi" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-body font-medium text-muted-foreground group-hover:text-foreground">Kazi</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-3 space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm font-body ${
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
                      placeholder="Ask about jobs..."
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-body text-foreground outline-none placeholder:text-muted-foreground"
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

      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-primary card-shadow-hover overflow-hidden border-4 border-card hover:scale-105 transition-transform"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <img src={avatarImg} alt="Kazi assistant" className="w-full h-full object-cover" />
      </motion.button>
    </div>
  );
};

export default AvatarAssistant;
