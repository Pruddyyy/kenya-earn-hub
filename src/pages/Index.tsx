import { useState, useEffect, useMemo } from "react";
import { Search, TrendingUp, Star, Zap, RefreshCw, Globe } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import ResourceSection from "@/components/ResourceSection";
import AvatarAssistant from "@/components/AvatarAssistant";
import { mockJobs } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/jobs";
import { useToast } from "@/hooks/use-toast";

// Map DB row to frontend Job type
function mapDbJob(row: any): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    platform: row.source_platform || row.company,
    category: row.category as any,
    payRate: row.pay_rate || 'Varies',
    currency: (row.currency || 'USD') as any,
    paymentMethods: row.payment_methods || [],
    duration: row.duration || 'Varies',
    paymentFrequency: 'Varies',
    requirements: row.requirements || [],
    skillLevel: (row.skill_level || 'Beginner') as any,
    kenyaAccessible: row.kenya_accessible ?? true,
    vpnRequired: false,
    mpesaCompatible: row.mpesa_compatible ?? false,
    estimatedMonthly: '',
    link: row.source_url || '#',
    isNew: new Date(row.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    scamRisk: (row.scam_risk?.toLowerCase() || 'safe') as any,
    postedDate: new Date(row.created_at).toLocaleDateString(),
    countryOrigin: row.country_origin,
  };
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mpesaOnly, setMpesaOnly] = useState(false);
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbJobs, setDbJobs] = useState<Job[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch jobs from database
  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(100);

    if (data && data.length > 0) {
      setDbJobs(data.map(mapDbJob));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Combine DB jobs with mock jobs (mock as fallback)
  const allJobs = dbJobs.length > 0 ? [...dbJobs, ...mockJobs] : mockJobs;

  // Deduplicate by title+company
  const dedupedJobs = useMemo(() => {
    const seen = new Set<string>();
    return allJobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    return dedupedJobs.filter((job) => {
      if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
      if (mpesaOnly && !job.mpesaCompatible) return false;
      if (beginnerOnly && job.skillLevel !== "Beginner") return false;
      if (selectedPayment !== "All" && !job.paymentMethods.includes(selectedPayment)) return false;
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [dedupedJobs, selectedCategory, mpesaOnly, beginnerOnly, selectedPayment, searchQuery]);

  const handleScanJobs = async () => {
    setIsScanning(true);
    toast({ title: "🌍 Scanning international job sites...", description: "Searching USA, UAE, UK, China and more for Kenya-accessible jobs" });

    try {
      const { data, error } = await supabase.functions.invoke('scan-jobs', {
        body: { maxQueries: 8 },
      });

      if (error) throw error;

      if (data?.success) {
        toast({ title: "✅ Scan complete!", description: `Found ${data.jobsFound} new jobs from ${data.queriesRun} searches` });
        setLastScan(new Date().toLocaleTimeString());
        await fetchJobs();
      } else {
        throw new Error(data?.error || 'Scan failed');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      toast({ title: "Scan error", description: err.message || "Failed to scan jobs", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

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
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-body">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground"><strong className="text-foreground">{dedupedJobs.length}</strong> Verified Jobs</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground"><strong className="text-foreground">{dedupedJobs.filter(j => j.skillLevel === "Beginner").length}</strong> Beginner Friendly</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground"><strong className="text-foreground">{dedupedJobs.filter(j => j.mpesaCompatible).length}</strong> M-Pesa Compatible</span>
            </div>
          </div>

          {/* Scan Button */}
          <button
            onClick={handleScanJobs}
            disabled={isScanning}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-display font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isScanning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {isScanning ? "Scanning..." : "Scan International Jobs"}
          </button>
        </div>
        {lastScan && (
          <div className="container max-w-6xl mx-auto px-4 pb-2">
            <p className="text-xs text-muted-foreground font-body">Last scan: {lastScan}</p>
          </div>
        )}
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
