const API_KEY = 'AIzaSyCh2O44iFsuUkNZOe2J1hqhh07fT1lu4SY'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
// gemini-1.5-flash-8b has the most generous free tier (15 RPM, 1M TPM)
const MODEL    = 'gemini-1.5-flash-8b'

import { gscSummary, gscTopKeywords, gscTopPages } from '../data/gscData'
import { ga4Summary, ga4Channels, ga4Events }       from '../data/ga4Data'
import { apkSummary, apkByCountry }                  from '../data/apkData'
import { claritySummary, clarityHeatmapInsights }    from '../data/clarityData'
import { bingSummary }                               from '../data/bingData'
import { yandexSummary }                             from '../data/yandexData'
import { countrySummaryGSC, countrySummaryGA4 }      from '../data/countryData'

type CountryKey = keyof typeof countrySummaryGSC

async function callGemini(prompt: string, retries = 2): Promise<string> {
  const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })

  if (res.status === 429 && retries > 0) {
    // Parse retry delay from error body if available
    const errBody = await res.json().catch(() => ({}))
    const match   = JSON.stringify(errBody).match(/retry in (\d+(?:\.\d+)?)s/)
    const delay   = match ? Math.ceil(parseFloat(match[1])) * 1000 : 8000
    await new Promise((r) => setTimeout(r, Math.min(delay, 15000)))
    return callGemini(prompt, retries - 1)
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const msg = errBody?.error?.message ?? `HTTP ${res.status}`
    // Give a clear billing hint if quota is exhausted
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error(
        'Gemini free-tier quota exceeded. To continue using AI Insights, enable billing on your Google Cloud project at console.cloud.google.com — the cost for this usage is minimal (< $1/month).'
      )
    }
    throw new Error(msg)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

function buildContext(country: string, dateRange: string): string {
  const isFiltered = country !== 'All'
  const ck = country as CountryKey

  // Use country-specific GSC/GA4 stats when filtered
  const gsc = isFiltered ? countrySummaryGSC[ck] : gscSummary
  const ga4 = isFiltered ? countrySummaryGA4[ck] : ga4Summary

  const topKw     = gscTopKeywords.slice(0, 5).map(k => `${k.keyword} (${k.clicks} clicks, pos ${k.position})`).join(', ')
  const topPages  = gscTopPages.slice(0, 5).map(p => `${p.url} (${p.clicks} clicks)`).join(', ')
  const topCh     = ga4Channels.slice(0, 4).map(c => `${c.channel}: ${c.sessions} sessions, ${c.convRate}% conv`).join(' | ')
  const topEvents = ga4Events.slice(0, 4).map(e => `${e.event}: ${e.count}`).join(', ')
  const apkCtry   = apkByCountry.map(c => `${c.country}: ${c.total}`).join(', ')
  const heatmap   = clarityHeatmapInsights.map(h => `${h.page}: ${h.insight}`).join('; ')

  const impressionsStr = gsc.totalImpressions >= 1e6
    ? `${(gsc.totalImpressions / 1e6).toFixed(2)}M`
    : `${(gsc.totalImpressions / 1e3).toFixed(0)}K`

  return `You are a senior digital analytics consultant for BandaBets, a sports betting platform in Africa.

FILTERS ACTIVE: Country = ${country} | Period = ${dateRange}

GOOGLE SEARCH CONSOLE${isFiltered ? ` (${country} only)` : ''}:
Clicks: ${gsc.totalClicks.toLocaleString()} (+${gsc.clicksChange}%) | Impressions: ${impressionsStr} | CTR: ${gsc.avgCtr}% | Avg Position: ${gsc.avgPosition}
Top queries: ${topKw}
Top pages: ${topPages}

GOOGLE ANALYTICS 4${isFiltered ? ` (${country} only)` : ''}:
Sessions: ${ga4.totalSessions.toLocaleString()} (+${ga4.sessionsChange}%) | Users: ${ga4.totalUsers.toLocaleString()} | Conversions: ${ga4.totalConversions.toLocaleString()} (+${ga4.conversionsChange}%) | Bounce: ${ga4.avgBounceRate}%
Channels: ${topCh} | Events: ${topEvents}

BING: Clicks ${bingSummary.totalClicks.toLocaleString()} | CTR ${bingSummary.avgCtr}% | Pos ${bingSummary.avgPosition}
YANDEX: Visits ${yandexSummary.visits.toLocaleString()} | Goals ${yandexSummary.goalReaches.toLocaleString()} | Bounce ${yandexSummary.bounceRate}%
CLARITY: Sessions ${claritySummary.totalSessions.toLocaleString()} | Scroll ${claritySummary.avgScrollDepth}% | Dead clicks ${claritySummary.deadClicks}% | Rage ${claritySummary.rageclicks}%
Heatmap: ${heatmap}
APK: Total ${apkSummary.totalDownloads.toLocaleString()} (+${apkSummary.downloadsChange}%) | Android ${apkSummary.androidDownloads.toLocaleString()} | By country: ${apkCtry}`
}

export interface GeminiInsight {
  type: 'win' | 'opportunity' | 'warning' | 'action'
  title: string
  body: string
  metric?: string
  source: string
}

export async function generateInsightsFromGemini(
  country: string,
  dateRange: string,
): Promise<GeminiInsight[]> {
  const prompt = `${buildContext(country, dateRange)}

Generate exactly 8 strategic insights for BandaBets. Return ONLY a raw JSON array (no markdown, no code fences) of 8 objects, each with:
- type: "win" | "opportunity" | "warning" | "action" (at least 2 of each)
- title: max 10 words
- body: 2-4 sentences with specific numbers from the data above
- metric: key supporting metric (short)
- source: data source name(s)

Be Africa/sports-betting focused and specific. No generic advice.`

  const text  = await callGemini(prompt)
  const clean = text.replace(/```json|```/g, '').trim()
  const match = clean.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Could not parse JSON from Gemini response')
  return JSON.parse(match[0]) as GeminiInsight[]
}

export async function askGemini(
  question: string,
  country: string,
  dateRange: string,
): Promise<string> {
  const prompt = `${buildContext(country, dateRange)}

USER QUESTION: ${question}

Answer concisely using the data above. Be direct and actionable. Plain text only (no markdown). Max 200 words.`

  return callGemini(prompt)
}
