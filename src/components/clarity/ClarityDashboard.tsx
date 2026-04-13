import { MousePointerClick, Scroll, AlertTriangle, Zap } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import { claritySummary, clarityDaily, clarityTopPages, clarityHeatmapInsights } from '../../data/clarityData'
import { useFilters, scale, sliceByDays } from '../../context/FilterContext'

const ACCENT = '#fa9602'

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const severityConfig = {
  positive: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  warning:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-100',  dot: 'bg-yellow-500' },
  error:    { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-100',     dot: 'bg-red-500'    },
  info:     { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-100',    dot: 'bg-blue-500'   },
}

export default function ClarityDashboard() {
  const { country, dateRange } = useFilters()
  const s = (v: number) => scale(v, country).toLocaleString()
  const daily = sliceByDays(clarityDaily, dateRange.days)

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-100">
          Microsoft Clarity
        </span>
        {country !== 'All' && (
          <span className="bg-accent-50 text-accent text-xs font-medium px-3 py-1 rounded-full">{country}</span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Recorded Sessions" value={s(claritySummary.totalSessions)} change={claritySummary.sessionsChange}   icon={<Zap size={18} className="text-accent" />}          iconBg="bg-accent-50" />
        <KPICard title="Avg Scroll Depth"  value={claritySummary.avgScrollDepth.toFixed(1)} suffix="%" change={claritySummary.scrollChange} icon={<Scroll size={18} className="text-blue-500" />}  iconBg="bg-blue-50" />
        <KPICard title="Dead Clicks"       value={`${claritySummary.deadClicks}%`}  change={claritySummary.deadClickChange}  invertChange icon={<MousePointerClick size={18} className="text-yellow-500" />} iconBg="bg-yellow-50" />
        <KPICard title="Rage Clicks"       value={`${claritySummary.rageclicks}%`}  change={claritySummary.errorChange}      invertChange icon={<AlertTriangle size={18} className="text-red-500" />}        iconBg="bg-red-50" />
      </div>

      {/* Engagement trend */}
      <div className="card p-5">
        <SectionHeader title="Session Engagement" description={`${dateRange.label} · Scroll depth & interaction quality`} />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={daily.map(d => ({ ...d, sessions: scale(d.sessions, country) }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(daily.length / 6)} />
            <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line yAxisId="left"  type="monotone" dataKey="sessions"    stroke={ACCENT}    strokeWidth={2} dot={false} name="Sessions"    />
            <Line yAxisId="right" type="monotone" dataKey="scrollDepth" stroke="#3b82f6"   strokeWidth={2} dot={false} name="Scroll Depth %" />
            <Line yAxisId="right" type="monotone" dataKey="deadClicks"  stroke="#f59e0b"   strokeWidth={2} dot={false} name="Dead Clicks %" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Page engagement + heatmap insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Page Engagement" description="Scroll depth by page" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={clarityTopPages} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="page" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={110} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="scrollDepth" fill={ACCENT} radius={[0, 4, 4, 0]} name="Scroll Depth" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Heatmap Insights" description="Behaviour highlights from session recordings" />
          <div className="space-y-2 mt-1">
            {clarityHeatmapInsights.map((item) => {
              const cfg = severityConfig[item.severity as keyof typeof severityConfig]
              return (
                <div key={item.page} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                  <div>
                    <p className={`text-xs font-semibold ${cfg.text}`}>{item.page}</p>
                    <p className={`text-xs mt-0.5 ${cfg.text} opacity-80`}>{item.insight}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
