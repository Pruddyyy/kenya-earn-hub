import { Job } from "@/types/jobs";
import { Clock, DollarSign, MapPin, Sparkles, Shield, Smartphone, Globe } from "lucide-react";
import { motion } from "framer-motion";

const categoryColors: Record<string, string> = {
  "AI Training": "badge-category",
  "Data Annotation": "badge-category",
  "Virtual Assistant": "bg-primary/10 text-primary",
  "Surveys": "badge-warning",
  "Freelancing": "bg-secondary/10 text-secondary",
  "Microtasks": "badge-warning",
  "Data Entry": "badge-category",
  "Content Moderation": "badge-category",
};

const countryFlags: Record<string, string> = {
  USA: "🇺🇸", UK: "🇬🇧", UAE: "🇦🇪", China: "🇨🇳", Canada: "🇨🇦",
  Germany: "🇩🇪", India: "🇮🇳", Australia: "🇦🇺", International: "🌍",
  Kenya: "🇰🇪", Japan: "🇯🇵", Singapore: "🇸🇬", Netherlands: "🇳🇱",
  France: "🇫🇷", Sweden: "🇸🇪", Switzerland: "🇨🇭", Ireland: "🇮🇪",
  "South Africa": "🇿🇦", Nigeria: "🇳🇬", Brazil: "🇧🇷",
};

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const flag = countryFlags[job.countryOrigin || "International"] || "🌍";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow duration-300 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium font-body ${categoryColors[job.category] || "badge-category"}`}>
              {job.category}
            </span>
            {job.countryOrigin && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent-foreground flex items-center gap-1">
                <Globe className="w-3 h-3" /> {flag} {job.countryOrigin}
              </span>
            )}
            {job.isNew && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary text-primary-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> New
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-foreground text-base leading-snug mt-2">{job.title}</h3>
          <p className="text-sm text-muted-foreground font-body">{job.company}</p>
        </div>
        <Shield className={`w-5 h-5 flex-shrink-0 ${job.scamRisk === "safe" ? "text-primary" : "text-warning"}`} />
      </div>

      {/* Requirements */}
      <div className="mb-3 flex-1">
        <p className="text-xs text-muted-foreground font-body font-medium uppercase tracking-wider mb-1.5">Requirements</p>
        <ul className="space-y-1">
          {job.requirements.slice(0, 3).map((req, i) => (
            <li key={i} className="text-sm text-foreground/80 font-body flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-3 mt-auto">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-sm font-body">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">{job.payRate}</span>
            <span className="text-muted-foreground">({job.currency})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <Clock className="w-3 h-3" />
            {job.duration}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {job.mpesaCompatible && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> M-Pesa
            </span>
          )}
          {job.paymentMethods.slice(0, 2).map((pm) => (
            <span key={pm} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {pm}
            </span>
          ))}
          {job.paymentMethods.length > 2 && (
            <span className="text-xs text-muted-foreground">+{job.paymentMethods.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <MapPin className="w-3 h-3" />
            Kenya ✓
          </div>
          <p className="text-xs text-muted-foreground font-body">{job.postedDate}</p>
        </div>

        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-center text-sm bg-primary/10 text-primary font-semibold font-display py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Apply Now →
        </a>
      </div>
    </motion.div>
  );
};

export default JobCard;
