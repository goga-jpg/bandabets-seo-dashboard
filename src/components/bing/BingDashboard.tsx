import { MousePointerClick, Eye, Link2, FileSearch } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable from '../common/DataTable'
import { bingSummary, bingDaily, bingTopKeywords, bingIndexStatus, bingBacklinks } from '../../data/bingData'
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

export default function BingDashboard() {
  const { country, dateRange } = useFilters()
  const s = (v: number) => scale(v, country).toLocaleString()
  const daily = sliceByDays(bingDaily, dateRange.days)

  const kwColumns = [
    { key: 'keyword',     header: 'Query',       render: (r: typeof bingTopKeywords[0]) => <span className="font-medium text-gray-800">{r.keyword}</span> },
    { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: typeof bingTopKeywords[0]) => scale(r.clicks, country).toLocaleString() },
    { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: typeof bingTopKeywords[0]) => scale(r.impressions, country).toLocaleString() },
    { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: typeof bingTopKeywords[0]) => `${r.ctr.toFixed(2)}%` },
    { key: 'position',    header: 'Position',    align: 'right' as const, render: (r: typeof bingTopKeywords[0]) => r.position.toFixed(1) },
  ]

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
          Bing Webmaster Tools
        </span>
        {country !== 'All' && (
          <span className="bg-accent-50 text-accent text-xs font-medium px-3 py-1 rounded-full">{country}</span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Bing Clicks"      value={s(bingSummary.totalClicks)}      change={bingSummary.clicksChange}      icon={<MousePointerClick size={18} className="text-accent" />}   iconBg="bg-accent-50" />
        <KPICard title="Impressions"      value={s(bingSummary.totalImpressions)} change={bingSummary.impressionsChange} icon={<Eye size={18} className="text-blue-500" />}               iconBg="bg-blue-50" />
        <KPICard title="Backlinks"        value={bingBacklinks.totalBacklinks.toLocaleString()}                          icon={<Link2 size={18} className="text-purple-500" />}           iconBg="bg-purple-50" />
        <KPICard title="Pages Indexed"    value={bingIndexStatus.pagesIndexed.toLocaleString()}                         icon={<FileSearch size={18} className="text-emerald-500" />}     iconBg="bg-emerald-50" />
      </div>

      {/* Trend */}
      <div className="card p-5">
        <SectionHeader title="Bing Search Performance" description={`${dateRange.label} · Clicks & Impressions`} />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={daily.map(d => ({ ...d, clicks: scale(d.clicks, country), impressions: scale(d.impressions, country) }))}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(daily.length / 6)} />
            <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line yAxisId="left"  type="monotone" dataKey="clicks"      stroke={ACCENT}    strokeWidth={2} dot={false} name="Clicks" />
            <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#3b82f6"   strokeWidth={2} dot={false} name="Impressions" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Index + backlinks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Index Status" />
          <div className="space-y-3 mt-2">
            {[
              { label: 'Pages Indexed',    value: bingIndexStatus.pagesIndexed,   color: 'bg-emerald-500' },
              { label: 'Pages Crawled',    value: bingIndexStatus.pagesCrawled,   color: 'bg-blue-500'    },
              { label: 'Sitemap Pages',    value: bingIndexStatus.sitemapPages,   color: ACCENT           },
              { label: 'Blocked Pages',    value: bingIndexStatus.pagesBlocked,   color: 'bg-yellow-500'  },
              { label: 'Crawl Errors',     value: bingIndexStatus.crawlErrors,    color: 'bg-red-500'     },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} style={item.color === ACCENT ? { background: ACCENT } : {}} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Backlink Profile" />
          <div className="space-y-3 mt-2">
            {[
              { label: 'Total Backlinks',     value: bingBacklinks.totalBacklinks     },
              { label: 'Referring Domains',   value: bingBacklinks.referringDomains   },
              { label: 'DoFollow Links',      value: bingBacklinks.doFollowLinks      },
              { label: 'NoFollow Links',      value: bingBacklinks.noFollowLinks      },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top keywords */}
      <div className="card p-5">
        <SectionHeader title="Top Bing Queries" description={dateRange.label} />
        <DataTable columns={kwColumns} data={bingTopKeywords} rowKey="keyword" />
      </div>
    </div>
  )
}
