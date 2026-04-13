import { useState } from 'react'
import { Search, MousePointerClick, Eye, Crosshair, Monitor, Smartphone, Tablet } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable, { ChangeCell } from '../common/DataTable'
import {
  gscSummary, gscDailyData, gscTopKeywords, gscTopPages,
  gscDeviceData, gscCountryData, gscSearchAppearance,
  gscCoreWebVitals, gscIndexCoverage, gscCTRDistribution,
  GSCKeyword, GSCPage,
} from '../../data/gscData'
import { countryGSCData, countrySummaryGSC } from '../../data/countryData'
import { useFilters, sliceByDays } from '../../context/FilterContext'

type MetricKey = 'clicks' | 'impressions' | 'ctr' | 'position'

const ACCENT = '#fa9602'
const DEVICE_COLORS = [ACCENT, '#3b82f6', '#10b981']

const metricOptions: { key: MetricKey; label: string; color: string }[] = [
  { key: 'clicks',      label: 'Clicks',      color: ACCENT    },
  { key: 'impressions', label: 'Impressions',  color: '#3b82f6' },
  { key: 'ctr',         label: 'CTR (%)',      color: '#10b981' },
  { key: 'position',    label: 'Avg Position', color: '#8b5cf6' },
]

const keywordColumns = [
  { key: 'keyword',     header: 'Query',       render: (r: GSCKeyword) => <span className="font-medium text-gray-800 text-xs">{r.keyword}</span> },
  { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: GSCKeyword) => r.clicks.toLocaleString() },
  { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: GSCKeyword) => r.impressions.toLocaleString() },
  { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: GSCKeyword) => `${r.ctr.toFixed(2)}%` },
  { key: 'position',    header: 'Position',    align: 'right' as const, render: (r: GSCKeyword) => r.position.toFixed(1) },
  { key: 'change',      header: 'Δ Clicks',    align: 'right' as const, render: (r: GSCKeyword) => <ChangeCell value={r.change} /> },
]

const pageColumns = [
  { key: 'url',         header: 'Page',        render: (r: GSCPage) => <span className="font-medium text-accent text-xs">{r.url}</span> },
  { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: GSCPage) => r.clicks.toLocaleString() },
  { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: GSCPage) => r.impressions.toLocaleString() },
  { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: GSCPage) => `${r.ctr.toFixed(2)}%` },
  { key: 'position',    header: 'Position',    align: 'right' as const, render: (r: GSCPage) => r.position.toFixed(1) },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' && p.value > 100 ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function GSCDashboard() {
  const { country, dateRange } = useFilters()
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['clicks', 'impressions'])
  const [activeTab, setActiveTab] = useState<'keywords' | 'pages'>('keywords')
  const [showAllKw, setShowAllKw] = useState(false)

  const isCountryFiltered = country !== 'All'

  // Use country-specific daily data when a country is selected
  const rawDailyData = isCountryFiltered
    ? countryGSCData[country as keyof typeof countryGSCData]
    : gscDailyData
  const dailyData = sliceByDays(rawDailyData, dateRange.days)

  // Country-specific summary values
  const ctry = isCountryFiltered ? countrySummaryGSC[country as keyof typeof countrySummaryGSC] : null
  const totalClicks     = ctry ? ctry.totalClicks    : gscSummary.totalClicks
  const avgCtr          = ctry ? ctry.avgCtr         : gscSummary.avgCtr
  const avgPosition     = ctry ? ctry.avgPosition    : gscSummary.avgPosition
  const totalImpressions = isCountryFiltered
    ? Math.round(gscSummary.totalImpressions * (totalClicks / gscSummary.totalClicks))
    : gscSummary.totalImpressions

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    )
  }

  const displayedKeywords = showAllKw ? gscTopKeywords : gscTopKeywords.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Country badge */}
      {isCountryFiltered && (
        <div className="flex items-center gap-2">
          <span className="bg-accent-50 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent-200">
            Showing data for {country}
          </span>
          <span className="text-xs text-gray-400">{dateRange.label}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          change={gscSummary.clicksChange}
          icon={<MousePointerClick size={18} className="text-accent" />}
          iconBg="bg-accent-50"
        />
        <KPICard
          title="Impressions"
          value={(totalImpressions / 1_000_000).toFixed(2) + 'M'}
          change={gscSummary.impressionsChange}
          icon={<Eye size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Avg CTR"
          value={avgCtr.toFixed(2)}
          suffix="%"
          change={gscSummary.ctrChange}
          icon={<Search size={18} className="text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg Position"
          value={avgPosition.toFixed(1)}
          change={gscSummary.positionChange}
          changeLabel="lower = better"
          invertChange
          icon={<Crosshair size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Performance chart */}
      <div className="card p-5">
        <SectionHeader
          title={isCountryFiltered ? `Search Performance — ${country}` : 'Search Performance'}
          description={`${dateRange.label} · Click metric toggles below`}
        />
        <div className="flex gap-2 mb-4 flex-wrap">
          {metricOptions.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                activeMetrics.includes(key) ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={activeMetrics.includes(key) ? { background: color, borderColor: color } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: activeMetrics.includes(key) ? 'white' : color }} />
              {label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dailyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(dailyData.length / 6)} />
            <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {activeMetrics.includes('clicks')      && <Line yAxisId="left"  type="monotone" dataKey="clicks"      stroke={ACCENT}    strokeWidth={2} dot={false} name="Clicks"      />}
            {activeMetrics.includes('impressions') && <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#3b82f6"   strokeWidth={2} dot={false} name="Impressions" />}
            {activeMetrics.includes('ctr')         && <Line yAxisId="left"  type="monotone" dataKey="ctr"         stroke="#10b981"   strokeWidth={2} dot={false} name="CTR (%)"     />}
            {activeMetrics.includes('position')    && <Line yAxisId="left"  type="monotone" dataKey="position"    stroke="#8b5cf6"   strokeWidth={2} dot={false} name="Avg Position"/>}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Search appearance */}
      {!isCountryFiltered && (
        <div className="card p-5">
          <SectionHeader title="Search Appearance" description="Clicks & impressions by result type" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {gscSearchAppearance.map((a) => (
              <div key={a.type} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                  <span className="text-xs font-medium text-gray-600">{a.type}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{a.clicks.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{a.impressions.toLocaleString()} impressions</p>
                <p className="text-xs font-medium mt-1" style={{ color: a.color }}>{a.ctr}% CTR</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device + Country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Device Breakdown" description="Clicks by device type" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={gscDeviceData} dataKey="clicks" nameKey="device" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {gscDeviceData.map((_, i) => <Cell key={i} fill={DEVICE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {gscDeviceData.map((d, i) => {
                const Icon = d.device === 'Mobile' ? Smartphone : d.device === 'Desktop' ? Monitor : Tablet
                const total = gscDeviceData.reduce((s, x) => s + x.clicks, 0)
                const pct = ((d.clicks / total) * 100).toFixed(1)
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    <Icon size={14} style={{ color: DEVICE_COLORS[i] }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{d.device}</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DEVICE_COLORS[i] }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Top Countries" description="Clicks by country" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gscCountryData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={90} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="clicks" fill={ACCENT} radius={[0, 4, 4, 0]} name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CTR Distribution + Core Web Vitals */}
      {!isCountryFiltered && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <SectionHeader title="CTR Distribution" description="Number of pages by click-through range" />
            <div className="space-y-3 mt-2">
              {gscCTRDistribution.map((d) => {
                const max = Math.max(...gscCTRDistribution.map(x => x.pages))
                return (
                  <div key={d.range}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">{d.range}</span>
                      <span className="text-gray-500 font-semibold">{d.pages} pages</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.pages / max) * 100}%`, background: d.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Core Web Vitals" description="Mobile vs Desktop performance scores" />
            <div className="space-y-4">
              {(['mobile', 'desktop'] as const).map((device) => {
                const v = gscCoreWebVitals[device]
                return (
                  <div key={device}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide capitalize mb-2">{device}</p>
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${v.good}%` }} />
                        <div className="h-full bg-yellow-400" style={{ width: `${v.needsWork}%` }} />
                        <div className="h-full bg-red-500"    style={{ width: `${v.poor}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="text-emerald-600 font-medium">✓ {v.good}% good</span>
                      <span className="text-yellow-600">⚠ {v.needsWork}% needs work</span>
                      <span className="text-red-500">✗ {v.poor}% poor</span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      <span>LCP {v.lcp}</span>
                      <span>FID {v.fid}</span>
                      <span>CLS {v.cls}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Index coverage */}
      {!isCountryFiltered && (
        <div className="card p-5">
          <SectionHeader title="Index Coverage" description="Page indexing status" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Valid',           value: gscIndexCoverage.valid,            color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Valid w/ Warning',value: gscIndexCoverage.validWithWarning, color: 'text-yellow-600',  bg: 'bg-yellow-50'  },
              { label: 'Excluded',        value: gscIndexCoverage.excluded,         color: 'text-gray-600',    bg: 'bg-gray-50'    },
              { label: 'Error',           value: gscIndexCoverage.error,            color: 'text-red-600',     bg: 'bg-red-50'     },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-xl p-4 border border-opacity-30`}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Not indexed — reasons</p>
            <div className="space-y-1">
              {gscIndexCoverage.notIndexedReasons.map((r) => (
                <div key={r.reason} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{r.reason}</span>
                  <span className="font-semibold text-gray-800">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keywords & Pages table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['keywords', 'pages'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Top {tab === 'keywords' ? 'Queries' : 'Pages'}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">{dateRange.label}</span>
        </div>
        {activeTab === 'keywords' ? (
          <>
            <DataTable columns={keywordColumns} data={displayedKeywords} rowKey="keyword" />
            {!showAllKw && (
              <button onClick={() => setShowAllKw(true)} className="mt-3 text-xs text-accent font-medium hover:underline w-full text-center">
                Show all {gscTopKeywords.length} queries
              </button>
            )}
          </>
        ) : (
          <DataTable columns={pageColumns} data={gscTopPages} rowKey="url" />
        )}
      </div>
    </div>
  )
}
