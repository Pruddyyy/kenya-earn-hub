import { JobCategory } from "@/types/jobs";
import { Filter, Smartphone, Zap, Globe } from "lucide-react";

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  mpesaOnly: boolean;
  setMpesaOnly: (v: boolean) => void;
  beginnerOnly: boolean;
  setBeginnerOnly: (v: boolean) => void;
  selectedPayment: string;
  setSelectedPayment: (p: string) => void;
}

const categories: (JobCategory | "All")[] = [
  "All", "AI Training", "Data Annotation", "Virtual Assistant",
  "Surveys", "Freelancing", "Microtasks", "Data Entry", "Content Moderation",
];

const paymentMethods = ["All", "PayPal", "Payoneer", "M-Pesa", "Bank Transfer"];

const FilterSidebar = ({
  selectedCategory, setSelectedCategory,
  mpesaOnly, setMpesaOnly,
  beginnerOnly, setBeginnerOnly,
  selectedPayment, setSelectedPayment,
}: FilterSidebarProps) => {
  return (
    <aside className="bg-card rounded-xl p-5 card-shadow h-fit sticky top-4">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-primary" />
        <h2 className="font-display font-bold text-foreground">Filters</h2>
      </div>

      {/* Category */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground font-body font-medium uppercase tracking-wider mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-body font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground font-body font-medium uppercase tracking-wider mb-2">Payment Method</p>
        <div className="flex flex-wrap gap-1.5">
          {paymentMethods.map((pm) => (
            <button
              key={pm}
              onClick={() => setSelectedPayment(pm)}
              className={`text-xs px-3 py-1.5 rounded-full font-body font-medium transition-colors ${
                selectedPayment === pm
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setMpesaOnly(!mpesaOnly)}
            className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${mpesaOnly ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-card transition-transform ${mpesaOnly ? "translate-x-4" : ""}`} />
          </div>
          <span className="text-sm font-body text-foreground flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-primary" />
            M-Pesa Compatible
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setBeginnerOnly(!beginnerOnly)}
            className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${beginnerOnly ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-card transition-transform ${beginnerOnly ? "translate-x-4" : ""}`} />
          </div>
          <span className="text-sm font-body text-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-warning" />
            No Experience Needed
          </span>
        </label>

        <div className="flex items-center gap-2 text-xs text-primary font-body pt-2">
          <Globe className="w-3.5 h-3.5" />
          <span>All jobs verified for Kenya access — No VPN required</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
