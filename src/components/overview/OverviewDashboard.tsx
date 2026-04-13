import { MousePointerClick, Eye, Users, Target, TrendingUp, Activity, Percent } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import { gscSummary, gscDailyData } from '../../data/gscData'
import { ga4Summary, ga4DailyData, ga4Channels } from '../../data/ga4Data'
import {
  countryGSCData, countryGA4Data,
  countrySummaryGSC, countrySummaryGA4,
} from '../../data/countryData'
import { useFilters, sliceByDays } from '../../context/FilterContext'

const ACCENT = '#fa9602'
const BLUE = '#3b82f6'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  if (h >= 17 && h < 21) return 'Good evening'
  return 'Good night'
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewDashboard() {
  const { country, dateRange } = useFilters()
  const isFiltered = country !== 'All'
  const countryKey = country as keyof typeof countryGSCData

  const gsc  = isFiltered ? countrySummaryGSC[countryKey] : gscSummary
  const ga4  = isFiltered ? countrySummaryGA4[countryKey] : ga4Summary

  const gscDaily = sliceByDays(isFiltered ? countryGSCData[countryKey] : gscDailyData, dateRange.days)
  const ga4Daily = sliceByDays(isFiltered ? countryGA4Data[countryKey] : ga4DailyData, dateRange.days)

  const combinedTrend = gscDaily.map((g, i) => ({
    date: g.date,
    clicks:   g.clicks,
    sessions: ga4Daily[i]?.sessions ?? 0,
  }))

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #e07800 100%)` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">{getGreeting()} 👋</h2>
            <p className="text-orange-100 text-sm">
              {isFiltered
                ? `Analytics snapshot for ${country} · ${dateRange.label}`
                : `Here's your analytics snapshot for the last ${dateRange.label}.`}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{(gsc.totalClicks / 1000).toFixed(1)}K</p>
              <p className="text-xs text-orange-200">Organic Clicks</p>
            </div>
            <div className="w-px h-10 bg-orange-300 opacity-40" />
            <div className="text-center">
              <p className="text-2xl font-bold">{(ga4.totalSessions / 1000).toFixed(1)}K</p>
              <p className="text-xs text-orange-200">Total Sessions</p>
            </div>
            <div className="w-px h-10 bg-orange-300 opacity-40" />
            <div className="text-center">
              <p className="text-2xl font-bold">{ga4.totalConversions.toLocaleString()}</p>
              <p className="text-xs text-orange-200">Conversions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Country badge */}
      {isFiltered && (
        <div className="flex items-center gap-2">
          <span className="bg-accent-50 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent-200">
            {country} data
          </span>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPICard
          title="Organic Clicks"
          value={gsc.totalClicks.toLocaleString()}
          change={gsc.clicksChange}
          icon={<MousePointerClick size={18} className="text-accent" />}
          iconBg="bg-accent-50"
        />
        <KPICard
          title="Impressions"
          value={gsc.totalImpressions >= 1_000_000
            ? (gsc.totalImpressions / 1_000_000).toFixed(2) + 'M'
            : (gsc.totalImpressions / 1_000).toFixed(0) + 'K'}
          change={gsc.impressionsChange}
          icon={<Eye size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Sessions"
          value={ga4.totalSessions >= 1_000
            ? (ga4.totalSessions / 1_000).toFixed(1) + 'K'
            : ga4.totalSessions.toLocaleString()}
          change={ga4.sessionsChange}
          icon={<Activity size={18} className="text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Total Users"
          value={ga4.totalUsers >= 1_000
            ? (ga4.totalUsers / 1_000).toFixed(1) + 'K'
            : ga4.totalUsers.toLocaleString()}
          change={ga4.usersChange}
          icon={<Users size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Avg CTR"
          value={gsc.avgCtr.toFixed(2)}
          suffix="%"
          change={gsc.ctrChange}
          icon={<TrendingUp size={18} className="text-pink-500" />}
          iconBg="bg-pink-50"
        />
        <KPICard
          title="Conversions"
          value={ga4.totalConversions.toLocaleString()}
          change={ga4.conversionsChange}
          icon={<Target size={18} className="text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Engagement Rate"
          value={(100 - ga4.avgBounceRate).toFixed(1)}
          suffix="%"
          change={ga4.bounceRateChange !== undefined ? +(Math.abs(ga4.bounceRateChange)).toFixed(1) : undefined}
          icon={<Percent size={18} className="text-teal-500" />}
          iconBg="bg-teal-50"
        />
      </div>

      {/* Combined trend */}
      <div className="card p-5">
        <SectionHeader
          title="Clicks vs Sessions"
          description={`Organic search clicks (GSC) vs GA4 sessions · ${dateRange.label}${isFiltered ? ` · ${country}` : ''}`}
        />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={combinedTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(combinedTrend.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="clicks"   stroke={ACCENT} strokeWidth={2} dot={false} name="Organic Clicks" />
            <Line type="monotone" dataKey="sessions" stroke={BLUE}   strokeWidth={2} dot={false} name="GA4 Sessions" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Channel pie */}
        <div className="card p-5">
          <SectionHeader title="Acquisition Channels" description="GA4 session share by channel" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={ga4Channels}
                  dataKey="sessions"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {ga4Channels.map((ch, i) => (
                    <Cell key={i} fill={ch.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {ga4Channels.slice(0, 5).map((ch) => {
                const total = ga4Channels.reduce((s, x) => s + x.sessions, 0)
                const pct = ((ch.sessions / total) * 100).toFixed(1)
                return (
                  <div key={ch.channel} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: ch.color }} />
                    <span className="text-gray-600 flex-1">{ch.channel}</span>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key highlights */}
        <div className="card p-5">
          <SectionHeader title="Key Highlights" description="Performance at a glance" />
          <div className="space-y-3">
            {[
              {
                label: 'Avg. Search Position',
                value: `${gsc.avgPosition}`,
                badge: '↓ improved',
                positive: true,
              },
              {
                label: 'Avg. Session Duration',
                value: ga4.avgSessionDuration,
                badge: '',
                positive: true,
              },
              {
                label: 'Bounce Rate',
                value: `${ga4.avgBounceRate}%`,
                badge: `${Math.abs(ga4.bounceRateChange)}% ↓`,
                positive: true,
              },
              {
                label: 'New Users Share',
                value: `${((ga4.newUsers / ga4.totalUsers) * 100).toFixed(1)}%`,
                badge: '',
                positive: true,
              },
              {
                label: 'Organic Click-through',
                value: `${gsc.avgCtr}%`,
                badge: `+${gsc.ctrChange}%`,
                positive: true,
              },
              {
                label: 'Conv. Rate (est.)',
                value: `${((ga4.totalConversions / ga4.totalSessions) * 100).toFixed(2)}%`,
                badge: `+${ga4.conversionsChange}%`,
                positive: true,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  {item.badge && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
