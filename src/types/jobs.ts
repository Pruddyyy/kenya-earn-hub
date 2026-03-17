export interface Job {
  id: string;
  title: string;
  company: string;
  platform: string;
  category: JobCategory;
  payRate: string;
  currency: "USD" | "KES";
  paymentMethods: string[];
  duration: string;
  paymentFrequency: string;
  requirements: string[];
  skillLevel: "Beginner" | "Intermediate" | "Expert";
  kenyaAccessible: boolean;
  vpnRequired: boolean;
  mpesaCompatible: boolean;
  estimatedMonthly: string;
  link: string;
  isNew?: boolean;
  scamRisk: "safe" | "moderate" | "high";
  postedDate: string;
  countryOrigin?: string;
}

export type JobCategory =
  | "AI Training"
  | "Data Annotation"
  | "Virtual Assistant"
  | "Surveys"
  | "Freelancing"
  | "Microtasks"
  | "Data Entry"
  | "Content Moderation";

export interface JobPlatform {
  name: string;
  description: string;
  jobTypes: string[];
  paymentMethods: string[];
  link: string;
  legitimacyScore: number;
}
