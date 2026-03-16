import { useState, useMemo } from "react";
import { Search, TrendingUp, Star, Zap } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import ResourceSection from "@/components/ResourceSection";
import AvatarAssistant from "@/components/AvatarAssistant";
import { mockJobs } from "@/data/mockData";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mpesaOnly, setMpesaOnly] = useState(false);
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
      if (mpesaOnly && !job.mpesaCompatible) return false;
      if (beginnerOnly && job.skillLevel !== "Beginner") return false;
      if (selectedPayment !== "All" && !job.paymentMethods.includes(selectedPayment)) return false;
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedCategory, mpesaOnly, beginnerOnly, selectedPayment, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b border-border px-4 py-3">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-extrabold text-sm">KJ</span>
            </div>
            <span className="font-display font-bold text-foreground text-lg hidden sm:block">Kenya Jobs Finder</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-body text-muted-foreground">
            <a href="#jobs" className="hover:text-foreground transition-colors">Jobs</a>
            <a href="#platforms" className="hover:text-foreground transition-colors">Platforms</a>
          </div>
        </div>
      </nav>

      <HeroSection />

      {/* Stats Bar */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-body">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground"><strong className="text-foreground">{mockJobs.length}</strong> Verified Jobs</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-body">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-muted-foreground"><strong className="text-foreground">{mockJobs.filter(j => j.skillLevel === "Beginner").length}</strong> Beginner Friendly</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-body">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground"><strong className="text-foreground">{mockJobs.filter(j => j.mpesaCompatible).length}</strong> M-Pesa Compatible</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section id="jobs" className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                mpesaOnly={mpesaOnly}
                setMpesaOnly={setMpesaOnly}
                beginnerOnly={beginnerOnly}
                setBeginnerOnly={setBeginnerOnly}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />
            </div>

            {/* Job Grid */}
            <div className="flex-1">
              {filteredJobs.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredJobs.map((job, i) => (
                    <JobCard key={job.id} job={job} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-body text-lg">No jobs match your filters.</p>
                  <p className="text-muted-foreground font-body text-sm mt-1">Try adjusting your criteria above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <div id="platforms">
        <ResourceSection />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 Kenya Online Jobs Finder. All jobs verified for Kenya accessibility.
          </p>
        </div>
      </footer>

      <AvatarAssistant />
    </div>
  );
};

export default Index;
