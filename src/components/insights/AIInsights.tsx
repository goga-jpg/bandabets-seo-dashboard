import { useState } from 'react'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, RefreshCw } from 'lucide-react'
import { useFilters } from '../../context/FilterContext'
import { gscSummary } from '../../data/gscData'
import { ga4Summary } from '../../data/ga4Data'
import { apkSummary } from '../../data/apkData'
import { claritySummary } from '../../data/clarityData'

interface Insight {
  id: string
  type: 'win' | 'opportunity' | 'warning' | 'action'
  title: string
  body: string
  metric?: string
  source: string
}

function generateInsights(country: string, days: number): Insight[] {
  const all: Insight[] = [
    {
      id: 'gsc-ctr',
      type: 'win',
      title: 'CTR is above industry benchmark',
      body: `Your organic CTR of ${gscSummary.avgCtr}% is well above the typical 2–3% range for sports betting in Africa. Strong title tags and meta descriptions are paying off${country !== 'All' ? ` particularly in ${country}` : ''}.`,
      metric: `${gscSummary.avgCtr}% CTR`,
      source: 'Google Search Console',
    },
    {
      id: 'apk-growth',
      type: 'win',
      title: 'APK downloads growing fast',
      body: `Downloads are up +${apkSummary.downloadsChange}% period-over-period, with Android leading at ${Math.round((apkSummary.androidDownloads / apkSummary.totalDownloads) * 100)}% share. Nigeria drives the most installs — consider targeted Android-first campaigns there.`,
      metric: `+${apkSummary.downloadsChange}% downloads`,
      source: 'APK Tracking',
    },
    {
      id: 'conv-rate',
      type: 'win',
      title: 'Conversion rate improving',
      body: `GA4 shows conversions up +${ga4Summary.conversionsChange}% with ${ga4Summary.totalConversions.toLocaleString()} total conversions. Email channel has the highest conv. rate at 11.65% — invest more in lifecycle email campaigns.`,
      metric: `+${ga4Summary.conversionsChange}%`,
      source: 'GA4',
    },
    {
      id: 'position-gap',
      type: 'opportunity',
      title: 'Position 11–20 keywords ready to move to Page 1',
      body: `Several high-volume queries are ranking in positions 11–14, just off Page 1. Investing in targeted content and internal linking for "sports betting south africa", "live betting odds", and "cricket betting" could unlock significant organic traffic.`,
      metric: 'Avg pos. 14.2',
      source: 'Google Search Console',
    },
    {
      id: 'bing-gap',
      type: 'opportunity',
      title: 'Bing is under-optimised',
      body: `Bing accounts for a fraction of GSC volume yet shows a strong CTR of 4.39%. Submit an updated XML sitemap in Bing Webmaster Tools and claim your Bing Places listing to capture this low-competition traffic.`,
      metric: '4.39% Bing CTR',
      source: 'Bing Webmaster',
    },
    {
      id: 'mobile-bounce',
      type: 'opportunity',
      title: `${country !== 'All' ? country + ' users are' : '67% of sessions are'} on mobile`,
      body: `Mobile drives the majority of traffic yet the homepage bounce rate is 34%. A/B test a mobile-first hero layout with a prominent "Bet Now" CTA above the fold — even a 5% reduction in bounce rate would yield ~${Math.round(ga4Summary.totalSessions * 0.676 * 0.05).toLocaleString()} recovered sessions.`,
      metric: '67% mobile share',
      source: 'GA4 + Clarity',
    },
    {
      id: 'clarity-dead',
      type: 'warning',
      title: 'Dead clicks on promo banners',
      body: `Microsoft Clarity shows 12.4% dead-click rate on the /promotions page banner images. Users are trying to interact with non-clickable elements. Make banners fully clickable or add a visible CTA button to capture this intent.`,
      metric: '12.4% dead clicks',
      source: 'Microsoft Clarity',
    },
    {
      id: 'clarity-rage',
      type: 'warning',
      title: 'Rage clicks detected on casino filter tabs',
      body: `4.2% rage-click rate on /casino filter tabs suggests a UX friction point — likely slow filter response or tabs not registering taps on mobile. Investigate JS performance and consider optimistic UI updates for filters.`,
      metric: '4.2% rage clicks',
      source: 'Microsoft Clarity',
    },
    {
      id: 'old-versions',
      type: 'warning',
      title: '21.4% of users on outdated app versions',
      body: `Version 2.3.x and older account for 20% of active installs. These users miss key features and bug fixes. Push an in-app update prompt and consider adding a minimum version gate to encourage upgrades.`,
      metric: '20% on old versions',
      source: 'APK Tracking',
    },
    {
      id: 'yandex-social',
      type: 'action',
      title: 'Social traffic to Yandex is underperforming',
      body: `Social accounts for only 17.8% of Yandex visits with a high bounce rate. Russian-speaking audiences in target markets may respond better to Telegram-first content strategies — test short-form bet tips and live score alerts via a Telegram channel.`,
      metric: '17.8% social share',
      source: 'Yandex Metrica',
    },
    {
      id: 'trends-ipl',
      type: 'action',
      title: 'IPL 2025 search interest is surging (+340%)',
      body: `Google Trends shows cricket-related searches up +340% — a major opportunity ahead of the IPL season. Create dedicated landing pages for IPL match betting, publish daily tips content, and run targeted paid campaigns on cricket keywords now before CPC rises further.`,
      metric: '+340% IPL interest',
      source: 'Google Trends',
    },
    {
      id: 'scroll-depth',
      type: 'action',
      title: 'Improve homepage scroll depth (58%)',
      body: `Only 58% of homepage visitors scroll past the first section. Add a "Most Popular Bets" widget or live odds ticker in the second viewport to drive engagement. Clarity heatmaps show 24% of users never scroll past the hero — a sticky navigation CTA could recapture those users.`,
      metric: '58% scroll depth',
      source: 'Microsoft Clarity',
    },
  ]

  // Filter by days — show more insights for longer periods
  return days >= 30 ? all : all.slice(0, 8)
}

const typeConfig = {
  win:         { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', dot: '#10b981', label: 'Win'         },
  opportunity: { icon: TrendingUp,   bg: 'bg-blue-50',    border: 'border-blue-100',    badge: 'bg-blue-100 text-blue-700',       dot: '#3b82f6', label: 'Opportunity' },
  warning:     { icon: AlertTriangle,bg: 'bg-yellow-50',  border: 'border-yellow-100',  badge: 'bg-yellow-100 text-yellow-700',   dot: '#f59e0b', label: 'Warning'     },
  action:      { icon: Lightbulb,    bg: 'bg-purple-50',  border: 'border-purple-100',  badge: 'bg-purple-100 text-purple-700',   dot: '#8b5cf6', label: 'Action'      },
}

export default function AIInsights() {
  const { country, dateRange } = useFilters()
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filter, setFilter] = useState<'all' | Insight['type']>('all')

  const insights = generateInsights(country, dateRange.days)
  const filtered = filter === 'all' ? insights : insights.filter((i) => i.type === filter)

  const counts = {
    win:         insights.filter((i) => i.type === 'win').length,
    opportunity: insights.filter((i) => i.type === 'opportunity').length,
    warning:     insights.filter((i) => i.type === 'warning').length,
    action:      insights.filter((i) => i.type === 'action').length,
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setRefreshKey((k) => k + 1) }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-accent" />
              <h2 className="text-lg font-bold text-white">AI Insights</h2>
              <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-medium">Beta</span>
            </div>
            <p className="text-sm text-gray-400">
              Analysed {insights.length} signals across GSC, GA4, Yandex, Bing, Clarity & APK data
              {country !== 'All' ? ` · Filtered for ${country}` : ''}
              {` · ${dateRange.label}`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analysing…' : 'Refresh'}
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3 mt-4">
          {(Object.entries(counts) as [Insight['type'], number][]).map(([type, count]) => {
            const cfg = typeConfig[type]
            return (
              <div key={type} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                <span className="text-xs text-white font-medium">{count} {cfg.label}{count !== 1 ? 's' : ''}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'win', 'opportunity', 'warning', 'action'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
              filter === f
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-accent hover:text-accent'
            }`}
          >
            {f === 'all' ? `All (${insights.length})` : `${typeConfig[f].label} (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Insights grid */}
      <div key={refreshKey} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((insight) => {
          const cfg = typeConfig[insight.type]
          const Icon = cfg.icon
          return (
            <div key={insight.id} className={`card p-5 border ${cfg.border} ${cfg.bg}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm shrink-0`}>
                  <Icon size={16} style={{ color: cfg.dot }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{insight.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{insight.body}</p>
                  <div className="flex items-center gap-3 mt-3">
                    {insight.metric && (
                      <span className="text-xs font-semibold text-gray-800 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                        {insight.metric}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{insight.source}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
