import { mockPlatforms } from "@/data/mockData";
import { ExternalLink, Shield } from "lucide-react";
import { motion } from "framer-motion";

const ResourceSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground mb-2">
            Trusted Job Platforms
          </h2>
          <p className="text-muted-foreground font-body">
            Verified websites that regularly post remote jobs accessible in Kenya
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPlatforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-foreground">{platform.name}</h3>
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-body font-semibold text-primary">{platform.legitimacyScore}%</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">{platform.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {platform.jobTypes.map((jt) => (
                  <span key={jt} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-body">{jt}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {platform.paymentMethods.map((pm) => (
                  <span key={pm} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">{pm}</span>
                ))}
              </div>

              <a
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-secondary font-display font-semibold hover:underline"
              >
                Visit Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceSection;
