import { useState } from "react";
import { Search, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<null | { score: number; status: string; details: string[] }>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setChecking(true);
    setResult(null);

    // Simulated legitimacy check
    setTimeout(() => {
      const knownSafe = ["upwork.com", "fiverr.com", "remotasks.com", "appen.com", "clickworker.com", "toloka.ai"];
      const domain = url.replace(/https?:\/\//, "").replace(/\/.*/, "").toLowerCase();
      const isSafe = knownSafe.some((s) => domain.includes(s));
      const score = isSafe ? 85 + Math.floor(Math.random() * 15) : 20 + Math.floor(Math.random() * 30);

      setResult({
        score,
        status: score >= 75 ? "safe" : score >= 40 ? "moderate" : "high",
        details: isSafe
          ? ["Domain is well-established", "Accepts workers from Kenya", "Verified payment methods", "No VPN required"]
          : ["Domain age is recent", "Limited user reviews found", "Payment methods unverified", "Proceed with caution"],
      });
      setChecking(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="w-6 h-6 text-primary" />;
      case "moderate": return <AlertTriangle className="w-6 h-6 text-warning" />;
      default: return <XCircle className="w-6 h-6 text-destructive" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "safe": return "Likely Legitimate";
      case "moderate": return "Moderate Risk";
      default: return "High Risk";
    }
  };

  return (
    <section className="hero-gradient py-16 px-4 md:py-24">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-sm font-medium font-body tracking-wide uppercase">
              Website Legitimacy Checker
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 font-display leading-tight">
            Find Legit Online Jobs<br />Available in Kenya
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8 font-body max-w-2xl mx-auto">
            Verify job websites, discover real opportunities, and avoid scams. All jobs pay in USD or KES — no VPN needed.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleCheck}
          className="relative max-w-xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex bg-card rounded-xl overflow-hidden card-shadow p-1">
            <input
              type="text"
              placeholder="Paste a website URL to check legitimacy..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-foreground font-body text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={checking}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
            >
              {checking ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {checking ? "Checking..." : "Check"}
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="max-w-xl mx-auto bg-card rounded-xl p-5 card-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                {getStatusIcon(result.status)}
                <div>
                  <p className="font-display font-bold text-foreground">
                    Legitimacy Score: {result.score}%
                  </p>
                  <p className={`text-sm font-body ${result.status === "safe" ? "text-primary" : result.status === "moderate" ? "text-warning" : "text-destructive"}`}>
                    {getStatusLabel(result.status)}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {result.details.map((d, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${result.status === "safe" ? "bg-primary" : "bg-warning"}`} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
