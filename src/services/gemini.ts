import { GoogleGenerativeAI } from '@google/generative-ai'
import { gscSummary, gscTopKeywords, gscTopPages } from '../data/gscData'
import { ga4Summary, ga4Channels, ga4Events } from '../data/ga4Data'
import { apkSummary, apkByCountry } from '../data/apkData'
import { claritySummary, clarityHeatmapInsights } from '../data/clarityData'
import { bingSummary } from '../data/bingData'
import { yandexSummary } from '../data/yandexData'

const API_KEY = 'AIzaSyCh2O44iFsuUkNZOe2J1hqhh07fT1lu4SY'
const genAI = new GoogleGenerativeAI(API_KEY)

function buildDataContext(country: string, dateRange: string, question?: string): string {
  const topKw = gscTopKeywords.slice(0, 5).map(k => `${k.keyword} (${k.clicks} clicks, pos ${k.position})`).join(', ')
  const topPages = gscTopPages.slice(0, 5).map(p => `${p.url} (${p.clicks} clicks)`).join(', ')
  const topChannels = ga4Channels.slice(0, 4).map(c => `${c.channel}: ${c.sessions} sessions, ${c.convRate}% conv`).join(' | ')
  const topEvents = ga4Events.slice(0, 4).map(e => `${e.event}: ${e.count}`).join(', ')
  const apkCountries = apkByCountry.map(c => `${c.country}: ${c.total} downloads`).join(', ')
  const heatmapNotes = clarityHeatmapInsights.map(h => `${h.page}: ${h.insight}`).join('; ')

  return `
You are a senior digital analytics consultant for BandaBets, a sports betting platform operating in Africa.

CURRENT FILTERS:
- Country: ${country}
- Date Range: ${dateRange}

GOOGLE SEARCH CONSOLE:
- Total Clicks: ${gscSummary.totalClicks.toLocaleString()} (+${gscSummary.clicksChange}% vs prev period)
- Impressions: ${(gscSummary.totalImpressions / 1_000_000).toFixed(2)}M (+${gscSummary.impressionsChange}%)
- Avg CTR: ${gscSummary.avgCtr}% (+${gscSummary.ctrChange}%)
- Avg Position: ${gscSummary.avgPosition} (improved ${Math.abs(gscSummary.positionChange)} places)
- Top Queries: ${topKw}
- Top Pages: ${topPages}

GOOGLE ANALYTICS 4:
- Sessions: ${ga4Summary.totalSessions.toLocaleString()} (+${ga4Summary.sessionsChange}%)
- Users: ${ga4Summary.totalUsers.toLocaleString()} (+${ga4Summary.usersChange}%)
- Conversions: ${ga4Summary.totalConversions.toLocaleString()} (+${ga4Summary.conversionsChange}%)
- Bounce Rate: ${ga4Summary.avgBounceRate}% (${ga4Summary.bounceRateChange}% change)
- Avg Session Duration: ${ga4Summary.avgSessionDuration}
- Top Channels: ${topChannels}
- Key Events: ${topEvents}

BING WEBMASTER:
- Clicks: ${bingSummary.totalClicks.toLocaleString()} (+${bingSummary.clicksChange}%)
- Impressions: ${bingSummary.totalImpressions.toLocaleString()}
- CTR: ${bingSummary.avgCtr}%, Avg Position: ${bingSummary.avgPosition}

YANDEX METRICA:
- Visits: ${yandexSummary.visits.toLocaleString()} (+${yandexSummary.visitsChange}%)
- Goal Reaches: ${yandexSummary.goalReaches.toLocaleString()} (+${yandexSummary.goalChange}%)
- Bounce Rate: ${yandexSummary.bounceRate}%

MICROSOFT CLARITY:
- Recorded Sessions: ${claritySummary.totalSessions.toLocaleString()}
- Avg Scroll Depth: ${claritySummary.avgScrollDepth}%
- Dead Click Rate: ${claritySummary.deadClicks}%
- Rage Click Rate: ${claritySummary.rageclicks}%
- Heatmap Notes: ${heatmapNotes}

APK DOWNLOADS:
- Total: ${apkSummary.totalDownloads.toLocaleString()} (+${apkSummary.downloadsChange}%)
- Android: ${apkSummary.androidDownloads.toLocaleString()} | iOS: ${apkSummary.iosDownloads.toLocaleString()}
- By Country: ${apkCountries}
- Active Installs: ${apkSummary.activeInstalls.toLocaleString()}
${question ? `\nUSER QUESTION: ${question}` : ''}
`
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
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `${buildDataContext(country, dateRange)}

Based on this analytics data, generate exactly 8 strategic insights for BandaBets.
Return ONLY valid JSON — an array of 8 objects, each with these exact fields:
- type: one of "win", "opportunity", "warning", or "action"
- title: short insight title (max 10 words)
- body: detailed explanation with specific numbers from the data (2-4 sentences)
- metric: key metric that supports this insight (short, e.g. "+22% conversions")
- source: the data source(s) this came from

Mix the types: include at least 2 wins, 2 opportunities, 2 warnings, 2 actions.
Focus on Africa-specific context and sports betting industry best practices.
Be specific and data-driven. No generic advice.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Extract JSON from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON found in response')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed as GeminiInsight[]
}

export async function askGemini(
  question: string,
  country: string,
  dateRange: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `${buildDataContext(country, dateRange, question)}

Answer the user's question concisely and specifically, using the data above.
Be direct and actionable. Format your response in plain text (no markdown headers).
Keep it under 200 words unless the question requires more detail.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
