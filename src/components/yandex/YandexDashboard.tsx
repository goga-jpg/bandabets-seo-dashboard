import { BarChart2, Users, Target, TrendingDown } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable from '../common/DataTable'
import { yandexSummary, yandexDaily, yandexSources, yandexTopPages, yandexGoals } from '../../data/yandexData'
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
          <span className="font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function YandexDashboard() {
  const { country, dateRange } = useFilters()
  const s = (v: number) => scale(v, country).toLocaleString()
  const daily = sliceByDays(yandexDaily, dateRange.days)

  const pageColumns = [
    { key: 'page',       header: 'Page',         render: (r: typeof yandexTopPages[0]) => <span className="font-medium text-accent">{r.page}</span> },
    { key: 'visits',     header: 'Visits',       align: 'right' as const, render: (r: typeof yandexTopPages[0]) => scale(r.visits, country).toLocaleString() },
    { key: 'avgTime',    header: 'Avg Time',     align: 'right' as const },
    { key: 'bounceRate', header: 'Bounce Rate',  align: 'right' as const, render: (r: typeof yandexTopPages[0]) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.bounceRate < 30 ? 'bg-emerald-50 text-emerald-600' : r.bounceRate < 40 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'}`}>
        {r.bounceRate}%
      </span>
    )},
  ]

  const goalColumns = [
    { key: 'goal',      header: 'Goal',        render: (r: typeof yandexGoals[0]) => <span className="font-medium text-gray-800">{r.goal}</span> },
    { key: 'reaches',   header: 'Completions', align: 'right' as const, render: (r: typeof yandexGoals[0]) => scale(r.reaches, country).toLocaleString() },
    { key: 'convRate',  header: 'Conv. Rate',  align: 'right' as const, render: (r: typeof yandexGoals[0]) => `${r.convRate}%` },
    { key: 'change',    header: 'Change',      align: 'right' as const, render: (r: typeof yandexGoals[0]) => (
      <span className="text-xs font-medium text-emerald-600">+{r.change}%</span>
    )},
  ]

  return (
    <div className="space-y-6">
      {/* Source badge */}
      <div className="flex items-center gap-2">
        <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
          Yandex Metrica
        </span>
        {country !== 'All' && (
          <span className="bg-accent-50 text-accent text-xs font-medium px-3 py-1 rounded-full">
            {country}
          </span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Visits"   value={s(yandexSummary.visits)}       change={yandexSummary.visitsChange}  icon={<BarChart2 size={18} className="text-accent" />}       iconBg="bg-accent-50" />
        <KPICard title="Unique Users"   value={s(yandexSummary.users)}        change={yandexSummary.usersChange}   icon={<Users size={18} className="text-blue-500" />}         iconBg="bg-blue-50" />
        <KPICard title="Goal Reaches"   value={s(yandexSummary.goalReaches)}  change={yandexSummary.goalChange}    icon={<Target size={18} className="text-purple-500" />}      iconBg="bg-purple-50" />
        <KPICard title="Bounce Rate"    value={yandexSummary.bounceRate.toFixed(1)} suffix="%" change={yandexSummary.bounceChange} invertChange icon={<TrendingDown size={18} className="text-emerald-500" />} iconBg="bg-emerald-50" />
      </div>

      {/* Visit trend */}
      <div className="card p-5">
        <SectionHeader title="Visit Trend" description={`${dateRange.label} · Visits & Pageviews`} />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={daily.map(d => ({ ...d, visits: scale(d.visits, country), pageviews: scale(d.pageviews, country) }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(daily.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="visits"    stroke={ACCENT}    strokeWidth={2} dot={false} name="Visits"    />
            <Line type="monotone" dataKey="pageviews" stroke="#3b82f6"   strokeWidth={2} dot={false} name="Pageviews" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sources + pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Traffic Sources" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={yandexSources} dataKey="visits" cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3}>
                  {yandexSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {yandexSources.map((src) => (
                <div key={src.source} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: src.color }} />
                  <span className="text-gray-600 flex-1">{src.source}</span>
                  <span className="font-semibold text-gray-800">{src.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Top Pages" />
          <DataTable columns={pageColumns} data={yandexTopPages} rowKey="page" />
        </div>
      </div>

      {/* Goals */}
      <div className="card p-5">
        <SectionHeader title="Goal Completions" description="Conversion tracking across key actions" />
        <DataTable columns={goalColumns} data={yandexGoals} rowKey="goal" />
      </div>
    </div>
  )
}
