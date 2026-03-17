
-- Create jobs table to store scraped job listings
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  skill_level TEXT NOT NULL DEFAULT 'Beginner',
  pay_rate TEXT,
  currency TEXT DEFAULT 'USD',
  payment_methods TEXT[],
  mpesa_compatible BOOLEAN DEFAULT false,
  duration TEXT,
  job_type TEXT,
  source_url TEXT,
  source_platform TEXT,
  country_origin TEXT,
  kenya_accessible BOOLEAN DEFAULT true,
  scam_risk TEXT DEFAULT 'Low',
  legitimacy_score INTEGER DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (jobs are public listings)
CREATE POLICY "Jobs are publicly readable"
  ON public.jobs
  FOR SELECT
  USING (true);

-- Create index for common filters
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_mpesa ON public.jobs(mpesa_compatible);
CREATE INDEX idx_jobs_skill_level ON public.jobs(skill_level);
CREATE INDEX idx_jobs_country ON public.jobs(country_origin);
CREATE INDEX idx_jobs_active ON public.jobs(is_active);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
