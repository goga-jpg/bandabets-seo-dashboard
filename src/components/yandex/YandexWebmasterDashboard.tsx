import { FileSearch, AlertTriangle, CheckCircle2, Info, Globe2 } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable from '../common/DataTable'
import {
  ywSummary, ywDailyCrawl, ywTopQueries, ywSitemaps,
  ywIndexBreakdown, ywPageErrors,
} from '../../data/yandexWebmasterData'
import { useFilters, sliceByDays } from '../../context/FilterContext'

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

const severityConfig = {
  error:   { icon: AlertTriangle, bg: 'bg-red-50',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700'     },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  info:    { icon: Info,          bg: 'bg-blue-50',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700'   },
}

const sitemapStatusConfig = {
  ok:      { label: 'OK',      cls: 'bg-emerald-50 text-emerald-700' },
  warning: { label: 'Warning', cls: 'bg-yellow-50 text-yellow-700'   },
  error:   { label: 'Error',   cls: 'bg-red-50 text-red-700'         },
}

export default function YandexWebmasterDashboard() {
  const { dateRange } = useFilters()
  const daily = sliceByDays(ywDailyCrawl, dateRange.days)

  const queryColumns = [
    { key: 'query',       header: 'Query',       render: (r: typeof ywTopQueries[0]) => <span className="font-medium text-gray-800">{r.query}</span> },
    { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: typeof ywTopQueries[0]) => r.clicks.toLocaleString() },
    { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: typeof ywTopQueries[0]) => r.impressions.toLocaleString() },
    { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: typeof ywTopQueries[0]) => `${r.ctr.toFixed(2)}%` },
    { key: 'position',    header: 'Position',    align: 'right' as const, render: (r: typeof ywTopQueries[0]) => r.position.toFixed(1) },
  ]

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
          Yandex Webmaster
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pages Indexed"   value={ywSummary.pagesIndexed.toLocaleString()}   change={ywSummary.indexedChange}  icon={<FileSearch   size={18} className="text-accent" />}       iconBg="bg-accent-50"  />
        <KPICard title="New Indexed"     value={`+${ywSummary.newPagesIndexed}`}                                              icon={<CheckCircle2 size={18} className="text-emerald-500" />} iconBg="bg-emerald-50" />
        <KPICard title="Crawl Errors"    value={ywSummary.crawlErrors}                     change={ywSummary.errorChange}    invertChange icon={<AlertTriangle size={18} className="text-red-500" />}    iconBg="bg-red-50"     />
        <KPICard title="Internal Links"  value={ywSummary.internalLinks.toLocaleString()}                                    icon={<Globe2       size={18} className="text-blue-500" />}    iconBg="bg-blue-50"    />
      </div>

      {/* Crawl trend */}
      <div className="card p-5">
        <SectionHeader title="Daily Crawl Activity" description={`${dateRange.label} · Pages crawled vs indexed`} />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={daily} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(daily.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="crawled" stroke={ACCENT}    strokeWidth={2} dot={false} name="Crawled" />
            <Line type="monotone" dataKey="indexed" stroke="#10b981"   strokeWidth={2} dot={false} name="Indexed" />
            <Line type="monotone" dataKey="errors"  stroke="#ef4444"   strokeWidth={2} dot={false} name="Errors" strokeDasharray="3 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Index breakdown + errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Index pie */}
        <div className="card p-5">
          <SectionHeader title="Index Coverage" description="Page status breakdown" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={ywIndexBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3}>
                  {ywIndexBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {ywIndexBreakdown.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                    <span className="text-gray-600">{item.status}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page errors */}
        <div className="card p-5">
          <SectionHeader title="Page Errors & Warnings" description="Issues requiring attention" />
          <div className="space-y-2">
            {ywPageErrors.map((err) => {
              const cfg = severityConfig[err.severity as keyof typeof severityConfig]
              const Icon = cfg.icon
              return (
                <div key={err.type} className={`flex items-center justify-between p-3 rounded-lg ${cfg.bg}`}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={cfg.text} />
                    <span className={`text-sm font-medium ${cfg.text}`}>{err.type}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{err.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sitemaps */}
      <div className="card p-5">
        <SectionHeader title="Submitted Sitemaps" description="Sitemap indexing status" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Sitemap', 'Submitted', 'Pages', 'Indexed', 'Status'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ywSitemaps.map((s) => {
                const st = sitemapStatusConfig[s.status as keyof typeof sitemapStatusConfig]
                return (
                  <tr key={s.sitemap} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-accent">{s.sitemap}</td>
                    <td className="py-2.5 px-3 text-gray-600">{s.submitted}</td>
                    <td className="py-2.5 px-3 text-right">{s.pages}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-xs ${s.indexed < s.pages * 0.9 ? 'text-yellow-600' : 'text-emerald-600'} font-semibold`}>
                        {s.indexed} / {s.pages}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Yandex queries */}
      <div className="card p-5">
        <SectionHeader title="Top Yandex Search Queries" description="Clicks & impressions from Yandex Search" />
        <DataTable columns={queryColumns} data={ywTopQueries} rowKey="query" />
      </div>
    </div>
  )
}
