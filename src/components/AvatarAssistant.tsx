import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import avatarImg from "@/assets/avatar-assistant.png";

const avatarResponses: Record<string, string> = {
  "easy jobs": "I'd recommend starting with Remotasks or Swagbucks — they're beginner-friendly and accept workers from Kenya! 🎉",
  "mpesa": "Jobs on Upwork and Fiverr support M-Pesa withdrawals through Payoneer. I've highlighted M-Pesa compatible jobs in the listings!",
  "scam": "Use the legitimacy checker at the top of the page! Paste any URL and I'll help verify if it's safe. 🛡️",
  "virtual assistant": "Check out Belay and Time Etc for VA jobs. They hire remote assistants and pay $10–15/hr!",
  default: "I'm here to help you find legit online jobs in Kenya! Try asking about easy jobs, M-Pesa payments, or how to spot scams. 😊",
};

const AvatarAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Habari! 👋 I'm Kazi, your job-finding assistant. Ask me anything about online jobs in Kenya!" },
  ]);
  const [input, setInput] = useState("");

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
