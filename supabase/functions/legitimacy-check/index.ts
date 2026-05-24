import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const FIRECRAWL = "https://api.firecrawl.dev/v2";

async function fcSearch(query: string, key: string, limit = 5) {
  const r = await fetch(`${FIRECRAWL}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  });
  if (!r.ok) return null;
  return await r.json();
}

function extractDomain(input: string): string {
  let s = input.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  s = s.split("/")[0].toLowerCase();
  return s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "url is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const domain = extractDomain(url);

    // Gather real signals in parallel
    const [reviews, scamReports, registration, trustpilot] = await Promise.all([
      fcSearch(`${domain} reviews legit or scam`, FIRECRAWL_API_KEY, 6),
      fcSearch(`${domain} scam complaints Kenya OR Reddit`, FIRECRAWL_API_KEY, 5),
      fcSearch(`${domain} company registration OR "registered company" OR LLC OR Ltd OR BRS Kenya`, FIRECRAWL_API_KEY, 5),
      fcSearch(`site:trustpilot.com ${domain}`, FIRECRAWL_API_KEY, 3),
    ]);

    const flatten = (r: any) => {
      const items = r?.data?.web || r?.data || r?.web || [];
      return (Array.isArray(items) ? items : []).slice(0, 6).map((x: any) => ({
        title: x.title, url: x.url, description: x.description || x.snippet,
      }));
    };

    const evidence = {
      domain,
      reviews: flatten(reviews),
      scam_reports: flatten(scamReports),
      registration: flatten(registration),
      trustpilot: flatten(trustpilot),
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a website legitimacy analyst for Kenyan online job seekers. Analyze REAL evidence (user reviews, scam reports, company registration mentions, Trustpilot) and produce an honest legitimacy assessment. Be skeptical. Cite evidence from the provided sources only. Return ONLY valid JSON, no markdown." },
          { role: "user", content: `Analyze legitimacy of "${domain}" using this real web evidence:\n\n${JSON.stringify(evidence, null, 2)}\n\nReturn JSON: {"score": 0-100, "status": "safe"|"moderate"|"high", "registered": true|false|null, "registration_note": string, "review_summary": string, "details": [string, string, string, string, string], "sources": [{"title": string, "url": string}]}\n\nscore guide: 80+ legit & well-reviewed, 50-79 mixed/unclear, <50 scam signals. status: safe(>=75), moderate(40-74), high(<40). details = 5 short bullet findings grounded in evidence.` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error: ${aiRes.status} ${t}` }), {
        status: aiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
