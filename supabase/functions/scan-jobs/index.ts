import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// International job search queries targeting different regions and categories
const SEARCH_QUERIES = [
  // AI & Annotation
  'remote AI training jobs hiring Kenya Africa 2026',
  'data annotation jobs remote no VPN worldwide hiring',
  'remote data labeling jobs pay USD Kenya accessible',
  // Virtual Assistant
  'remote virtual assistant jobs hiring Africa Kenya',
  'virtual assistant jobs international hire Kenya remote',
  // Surveys & Microtasks
  'online survey jobs pay PayPal M-Pesa Kenya',
  'microtask jobs remote worldwide Clickworker Remotasks 2026',
  // Freelancing
  'freelance remote jobs Upwork Fiverr hiring Kenya',
  'remote freelance writing design jobs Africa',
  // International markets
  'remote jobs hiring from UAE Dubai for Africans',
  'remote jobs from China Alibaba hiring worldwide',
  'remote jobs USA companies hiring Kenya workers',
  'remote jobs UK Europe hiring African freelancers',
  // Content moderation & Data entry
  'remote content moderation jobs hiring worldwide',
  'remote data entry jobs no experience Kenya Africa',
];

interface ParsedJob {
  title: string;
  company: string;
  category: string;
  description: string;
  requirements: string[];
  skill_level: string;
  pay_rate: string;
  currency: string;
  payment_methods: string[];
  mpesa_compatible: boolean;
  duration: string;
  job_type: string;
  source_url: string;
  source_platform: string;
  country_origin: string;
  kenya_accessible: boolean;
  scam_risk: string;
  legitimacy_score: number;
}

function categorizeJob(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('annotation') || text.includes('labeling') || text.includes('label')) return 'Data Annotation';
  if (text.includes('ai training') || text.includes('ai eval') || text.includes('machine learning')) return 'AI Training';
  if (text.includes('virtual assistant') || text.includes('admin assistant') || text.includes('scheduling')) return 'Virtual Assistant';
  if (text.includes('survey')) return 'Surveys';
  if (text.includes('microtask') || text.includes('micro task')) return 'Microtasks';
  if (text.includes('data entry')) return 'Data Entry';
  if (text.includes('content moderation') || text.includes('moderator')) return 'Content Moderation';
  if (text.includes('freelance') || text.includes('freelancing')) return 'Freelancing';
  return 'Freelancing';
}

function detectCountry(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('uae') || lower.includes('dubai') || lower.includes('emirates')) return 'UAE';
  if (lower.includes('china') || lower.includes('chinese')) return 'China';
  if (lower.includes('usa') || lower.includes('united states') || lower.includes('u.s.')) return 'USA';
  if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('british')) return 'UK';
  if (lower.includes('canada')) return 'Canada';
  if (lower.includes('germany') || lower.includes('german')) return 'Germany';
  if (lower.includes('india') || lower.includes('indian')) return 'India';
  if (lower.includes('australia')) return 'Australia';
  return 'International';
}

function detectPaymentMethods(text: string): { methods: string[]; mpesa: boolean } {
  const lower = text.toLowerCase();
  const methods: string[] = [];
  if (lower.includes('paypal')) methods.push('PayPal');
  if (lower.includes('payoneer')) methods.push('Payoneer');
  if (lower.includes('m-pesa') || lower.includes('mpesa')) methods.push('M-Pesa');
  if (lower.includes('bank transfer') || lower.includes('wire')) methods.push('Bank Transfer');
  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('usdt')) methods.push('Crypto');
  if (methods.length === 0) methods.push('PayPal');
  return { methods, mpesa: methods.includes('M-Pesa') };
}

function detectSkillLevel(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('no experience') || lower.includes('beginner') || lower.includes('entry level') || lower.includes('entry-level')) return 'Beginner';
  if (lower.includes('expert') || lower.includes('senior') || lower.includes('advanced') || lower.includes('5+ year')) return 'Expert';
  return 'Intermediate';
}

function assessScamRisk(url: string, title: string): { risk: string; score: number } {
  const lower = `${url} ${title}`.toLowerCase();
  const scamKeywords = ['guaranteed income', 'get rich', 'no work required', 'mlm', 'pyramid', 'invest first', 'pay to join'];
  const trustedDomains = ['upwork.com', 'fiverr.com', 'remotasks.com', 'appen.com', 'clickworker.com', 'toloka.ai', 'linkedin.com', 'indeed.com', 'glassdoor.com', 'remoteok.com', 'weworkremotely.com', 'flexjobs.com'];
  
  for (const keyword of scamKeywords) {
    if (lower.includes(keyword)) return { risk: 'High', score: 20 };
  }
  for (const domain of trustedDomains) {
    if (lower.includes(domain)) return { risk: 'Low', score: 95 };
  }
  return { risk: 'Low', score: 75 };
}

function parseJobFromSearchResult(result: any): ParsedJob | null {
  if (!result.title || !result.url) return null;
  
  const text = `${result.title} ${result.description || ''} ${result.markdown || ''}`;
  const category = categorizeJob(result.title, result.description || '');
  const country = detectCountry(text);
  const { methods, mpesa } = detectPaymentMethods(text);
  const skillLevel = detectSkillLevel(text);
  const { risk, score } = assessScamRisk(result.url, result.title);
  
  // Extract company from URL or title
  let company = 'Remote Company';
  try {
    const urlObj = new URL(result.url);
    company = urlObj.hostname.replace('www.', '').split('.')[0];
    company = company.charAt(0).toUpperCase() + company.slice(1);
  } catch {}

  return {
    title: result.title.slice(0, 200),
    company,
    category,
    description: (result.description || '').slice(0, 500),
    requirements: ['Internet connection', 'Computer or smartphone'],
    skill_level: skillLevel,
    pay_rate: 'Varies',
    currency: 'USD',
    payment_methods: methods,
    mpesa_compatible: mpesa,
    duration: 'Varies',
    job_type: 'Remote',
    source_url: result.url,
    source_platform: company,
    country_origin: country,
    kenya_accessible: true,
    scam_risk: risk,
    legitimacy_score: score,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body for optional query limit
    let maxQueries = 5;
    try {
      const body = await req.json();
      if (body.maxQueries) maxQueries = Math.min(body.maxQueries, SEARCH_QUERIES.length);
    } catch {}

    const allJobs: ParsedJob[] = [];
    const queries = SEARCH_QUERIES.slice(0, maxQueries);

    for (const query of queries) {
      try {
        console.log(`Searching: ${query}`);
        const response = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            limit: 5,
            scrapeOptions: { formats: ['markdown'] },
          }),
        });

        if (!response.ok) {
          console.error(`Search failed for "${query}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        const results = data.data || [];

        for (const result of results) {
          const job = parseJobFromSearchResult(result);
          if (job) allJobs.push(job);
        }
      } catch (err) {
        console.error(`Error searching "${query}":`, err);
      }
    }

    console.log(`Found ${allJobs.length} jobs total`);

    // Deduplicate by source_url
    const seen = new Set<string>();
    const uniqueJobs = allJobs.filter(job => {
      if (seen.has(job.source_url)) return false;
      seen.add(job.source_url);
      return true;
    });

    // Upsert into database
    if (uniqueJobs.length > 0) {
      const { error } = await supabase
        .from('jobs')
        .upsert(
          uniqueJobs.map(job => ({
            ...job,
            is_active: true,
          })),
          { onConflict: 'source_url' }
        );

      if (error) {
        console.error('Database insert error:', error);
        // Try inserting one by one to skip duplicates
        let inserted = 0;
        for (const job of uniqueJobs) {
          const { error: singleError } = await supabase.from('jobs').insert({ ...job, is_active: true });
          if (!singleError) inserted++;
        }
        console.log(`Inserted ${inserted} jobs individually`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: uniqueJobs.length,
        queriesRun: queries.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
