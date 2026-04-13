import { useState } from 'react'
import { FileSearch, AlertTriangle, CheckCircle2, Zap, TrendingUp, MousePointerClick } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import { pageInsights, pageInsightsSummary } from '../../data/pageInsightsData'

const CWV_CONFIG = {
  'good':       { label: 'Good',        bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500'  },
  'needs-work': { label: 'Needs Work',  bg: 'bg-yellow-50',   text: 'text-yellow-700',   dot: 'bg-yellow-500'   },
  'poor':       { label: 'Poor',        bg: 'bg-red-50',      text: 'text-red-600',      dot: 'bg-red-500'      },
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof pageInsights[0] }[] }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-xs max-w-[200px]">
      <p className="font-semibold text-gray-800 mb-1">{d.url}</p>
      <p className="text-gray-500">CTR: <span className="font-medium text-gray-800">{d.ctr}%</span></p>
      <p className="text-gray-500">Position: <span className="font-medium text-gray-800">{d.position}</span></p>
      <p className="text-gray-500">Clicks: <span className="font-medium text-gray-800">{d.clicks.toLocaleString()}</span></p>
    </div>
  )
}

export default function PageInsightsDashboard() {
  const [filter, setFilter] = useState<'all' | 'good' | 'needs-work' | 'poor'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof pageInsights[0] | null>(null)

  const filtered = pageInsights.filter(p => {
    const matchFilter = filter === 'all' || p.coreWebVital === filter
    const matchSearch = p.url.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const scatterData = pageInsights.map(p => ({ ...p, x: p.position, y: p.ctr, z: p.clicks }))

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pages Tracked"    value={pageInsightsSummary.totalPages.toString()}        icon={<FileSearch      size={18} className="text-accent" />}        iconBg="bg-accent-50"  />
        <KPICard title="Good CWV"         value={pageInsightsSummary.goodCWV.toString()}           icon={<CheckCircle2    size={18} className="text-emerald-500" />}   iconBg="bg-emerald-50" />
        <KPICard title="Pages w/ Issues"  value={pageInsightsSummary.pagesWithIssues.toString()}   icon={<AlertTriangle   size={18} className="text-yellow-500" />}   iconBg="bg-yellow-50"  />
        <KPICard title="Avg Position"     value={pageInsightsSummary.avgPosition.toString()}       icon={<TrendingUp      size={18} className="text-blue-500" />}     iconBg="bg-blue-50"    />
      </div>

      {/* CTR vs Position scatter */}
      <div className="card p-5">
        <SectionHeader title="CTR vs Search Position" description="Bubble size = clicks. Pages bottom-right are under-performing." />
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="x" name="Position" type="number" domain={[1, 25]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} label={{ value: 'Avg Position', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#9ca3af' }} />
            <YAxis dataKey="y" name="CTR %" type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} unit="%" />
            <ZAxis dataKey="z" range={[60, 500]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={scatterData} fill="#fa9602" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Top pages by clicks bar */}
      <div className="card p-5">
        <SectionHeader title="Clicks by Page" description="Top 10 pages ranked by organic clicks" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[...pageInsights].sort((a,b) => b.clicks - a.clicks)} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="url" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={130} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey="clicks" fill="#fa9602" radius={[0,4,4,0]} name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'good', 'needs-work', 'poor'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? `All (${pageInsights.length})` : f === 'needs-work' ? 'Needs Work' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pages…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Page cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(page => {
          const cwv = CWV_CONFIG[page.coreWebVital]
          return (
            <div
              key={page.url}
              className={`card p-5 cursor-pointer transition-all hover:shadow-md ${selected?.url === page.url ? 'ring-2 ring-accent' : ''}`}
              onClick={() => setSelected(selected?.url === page.url ? null : page)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">{page.title}</p>
                  <p className="text-xs text-accent font-medium">{page.url}</p>
                </div>
                <span className={`ml-2 shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cwv.bg} ${cwv.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cwv.dot}`} />{cwv.label}
                </span>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: 'Clicks',    value: page.clicks.toLocaleString() },
                  { label: 'CTR',       value: `${page.ctr}%`              },
                  { label: 'Position',  value: page.position.toString()     },
                  { label: 'Bounce',    value: `${page.bounceRate}%`        },
                ].map(m => (
                  <div key={m.label} className="text-center bg-gray-50 rounded-lg py-2">
                    <p className="text-xs font-bold text-gray-900">{m.value}</p>
                    <p className="text-[10px] text-gray-400">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* CWV vitals */}
              <div className="flex gap-3 text-xs text-gray-500 mb-3">
                <span>LCP <span className={`font-semibold ${parseFloat(page.lcp) > 2.5 ? 'text-red-500' : 'text-emerald-600'}`}>{page.lcp}</span></span>
                <span>FID <span className={`font-semibold ${parseInt(page.fid) > 100 ? 'text-red-500' : 'text-emerald-600'}`}>{page.fid}</span></span>
                <span>CLS <span className={`font-semibold ${parseFloat(page.cls) > 0.1 ? 'text-red-500' : 'text-emerald-600'}`}>{page.cls}</span></span>
              </div>

              {/* Issues */}
              {page.issues.length > 0 && (
                <div className="space-y-1 mb-3">
                  {page.issues.map(issue => (
                    <div key={issue} className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 rounded px-2 py-1">
                      <AlertTriangle size={11} className="shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}

              {/* Opportunity */}
              {selected?.url === page.url && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={12} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">Opportunity</span>
                  </div>
                  <p className="text-xs text-blue-600 leading-relaxed">{page.opportunity}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-8 text-center text-gray-400 text-sm">
          No pages match your filter.
        </div>
      )}
    </div>
  )
}
