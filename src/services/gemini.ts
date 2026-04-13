import { gscSummary, gscTopKeywords, gscTopPages } from '../data/gscData'
import { ga4Summary, ga4Channels, ga4Events } from '../data/ga4Data'
import { apkSummary, apkByCountry } from '../data/apkData'
import { claritySummary, clarityHeatmapInsights } from '../data/clarityData'
import { bingSummary } from '../data/bingData'
import { yandexSummary } from '../data/yandexData'

const API_KEY = 'AIzaSyCh2O44iFsuUkNZOe2J1hqhh07fT1lu4SY'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL    = 'gemini-1.5-flash'

async function callGemini(prompt: string): Promise<string> {
  const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const msg = errBody?.error?.message ?? `HTTP ${res.status}`
    throw new Error(msg)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

function buildContext(country: string, dateRange: string): string {
  const topKw      = gscTopKeywords.slice(0, 5).map(k => `${k.keyword} (${k.clicks} clicks, pos ${k.position})`).join(', ')
  const topPages   = gscTopPages.slice(0, 5).map(p => `${p.url} (${p.clicks} clicks)`).join(', ')
  const topCh      = ga4Channels.slice(0, 4).map(c => `${c.channel}: ${c.sessions} sessions, ${c.convRate}% conv`).join(' | ')
  const topEvents  = ga4Events.slice(0, 4).map(e => `${e.event}: ${e.count}`).join(', ')
  const apkCountry = apkByCountry.map(c => `${c.country}: ${c.total}`).join(', ')
  const heatmap    = clarityHeatmapInsights.map(h => `${h.page}: ${h.insight}`).join('; ')

  return `You are a senior digital analytics consultant for BandaBets, a sports betting platform in Africa.

FILTERS ACTIVE: Country = ${country} | Period = ${dateRange}

GOOGLE SEARCH CONSOLE:
Clicks: ${gscSummary.totalClicks.toLocaleString()} (+${gscSummary.clicksChange}%) | Impressions: ${(gscSummary.totalImpressions/1e6).toFixed(2)}M | CTR: ${gscSummary.avgCtr}% | Avg Position: ${gscSummary.avgPosition}
Top queries: ${topKw}
Top pages: ${topPages}

GOOGLE ANALYTICS 4:
Sessions: ${ga4Summary.totalSessions.toLocaleString()} (+${ga4Summary.sessionsChange}%) | Users: ${ga4Summary.totalUsers.toLocaleString()} | Conversions: ${ga4Summary.totalConversions.toLocaleString()} (+${ga4Summary.conversionsChange}%) | Bounce: ${ga4Summary.avgBounceRate}%
Channels: ${topCh}
Events: ${topEvents}

BING: Clicks ${bingSummary.totalClicks.toLocaleString()} (+${bingSummary.clicksChange}%) | CTR ${bingSummary.avgCtr}% | Pos ${bingSummary.avgPosition}

YANDEX METRICA: Visits ${yandexSummary.visits.toLocaleString()} (+${yandexSummary.visitsChange}%) | Goals ${yandexSummary.goalReaches.toLocaleString()} | Bounce ${yandexSummary.bounceRate}%

CLARITY: Sessions ${claritySummary.totalSessions.toLocaleString()} | Scroll depth ${claritySummary.avgScrollDepth}% | Dead clicks ${claritySummary.deadClicks}% | Rage clicks ${claritySummary.rageclicks}%
Heatmap notes: ${heatmap}

APK DOWNLOADS: Total ${apkSummary.totalDownloads.toLocaleString()} (+${apkSummary.downloadsChange}%) | Android ${apkSummary.androidDownloads.toLocaleString()} | iOS ${apkSummary.iosDownloads.toLocaleString()} | Active installs ${apkSummary.activeInstalls.toLocaleString()}
By country: ${apkCountry}`
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

Generate exactly 8 strategic insights. Return ONLY a raw JSON array (no markdown, no code fences) of 8 objects each with:
- type: "win" | "opportunity" | "warning" | "action"  (include at least 2 of each)
- title: max 10 words
- body: 2-4 sentences with specific numbers from the data
- metric: key supporting metric (short string)
- source: data source name(s)

Be specific and Africa/sports-betting focused. No generic advice.`

  const text    = await callGemini(prompt)
  // Strip any accidental markdown code fences
  const clean   = text.replace(/```json|```/g, '').trim()
  const match   = clean.match(/\[[\s\S]*\]/)
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

Answer concisely and specifically using the data above. Be direct and actionable. Plain text only (no markdown). Max 200 words.`

  return callGemini(prompt)
}
