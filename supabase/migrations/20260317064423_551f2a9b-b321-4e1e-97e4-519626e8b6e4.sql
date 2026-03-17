
-- Add unique constraint on source_url for upsert deduplication
ALTER TABLE public.jobs ADD CONSTRAINT jobs_source_url_unique UNIQUE (source_url);
