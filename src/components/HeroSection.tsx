import { useState } from "react";
import { Search, Shield, CheckCircle, AlertTriangle, XCircle, ExternalLink, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type CheckResult = {
  score: number;
  status: "safe" | "moderate" | "high";
  registered: boolean | null;
  registration_note: string;
  review_summary: string;
  details: string[];
  sources: { title: string; url: string }[];
};

const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setChecking(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("legitimacy-check", {
        body: { url },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data as CheckResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check. Try again.");
    } finally {
      setChecking(false);
    }
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
            Real reviews. Real registration checks. Real verdicts — powered by live web data.
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
              {checking ? "Analyzing..." : "Check"}
            </button>
          </div>
          {checking && (
            <p className="text-primary-foreground/70 text-xs mt-2 font-body">
              Searching real reviews, scam reports & registration records...
            </p>
          )}
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-xl mx-auto bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-destructive text-sm font-body"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="max-w-xl mx-auto bg-card rounded-xl p-5 card-shadow text-left space-y-4"
            >
              <div className="flex items-center gap-3">
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

              <div className="flex items-start gap-2 bg-muted/40 rounded-lg p-3">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs font-body">
                  <p className="font-semibold text-foreground">
                    Registration: {result.registered === true ? "Verified" : result.registered === false ? "Not Found" : "Unclear"}
                  </p>
                  <p className="text-muted-foreground">{result.registration_note}</p>
                </div>
              </div>

              {result.review_summary && (
                <div className="text-xs font-body text-muted-foreground italic border-l-2 border-primary/40 pl-3">
                  "{result.review_summary}"
                </div>
              )}

              <ul className="space-y-1.5">
                {result.details?.map((d, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-2">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${result.status === "safe" ? "bg-primary" : "bg-warning"}`} />
                    {d}
                  </li>
                ))}
              </ul>

              {result.sources?.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-display font-semibold text-foreground mb-2">Sources</p>
                  <ul className="space-y-1">
                    {result.sources.slice(0, 5).map((s, i) => (
                      <li key={i}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-body flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{s.title || s.url}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
