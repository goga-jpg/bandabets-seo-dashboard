import { useState } from 'react'
import { Search, MousePointerClick, Eye, Crosshair, Monitor, Smartphone, Tablet } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable, { ChangeCell } from '../common/DataTable'
import {
  gscSummary, gscDailyData, gscTopKeywords, gscTopPages,
  gscDeviceData, gscCountryData, GSCKeyword, GSCPage,
} from '../../data/gscData'

type MetricKey = 'clicks' | 'impressions' | 'ctr' | 'position'

const ACCENT = '#fa9602'
const ACCENT2 = '#3b82f6'
const ACCENT3 = '#10b981'

const DEVICE_COLORS = [ACCENT, ACCENT2, ACCENT3]

const metricOptions: { key: MetricKey; label: string; color: string }[] = [
  { key: 'clicks',      label: 'Clicks',      color: ACCENT  },
  { key: 'impressions', label: 'Impressions',  color: ACCENT2 },
  { key: 'ctr',         label: 'CTR (%)',      color: ACCENT3 },
  { key: 'position',    label: 'Avg Position', color: '#8b5cf6' },
]

const keywordColumns = [
  { key: 'keyword',     header: 'Query',       render: (r: GSCKeyword) => <span className="font-medium text-gray-800">{r.keyword}</span> },
  { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: GSCKeyword) => r.clicks.toLocaleString() },
  { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: GSCKeyword) => r.impressions.toLocaleString() },
  { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: GSCKeyword) => <span>{r.ctr.toFixed(2)}%</span> },
  { key: 'position',    header: 'Position',    align: 'right' as const, render: (r: GSCKeyword) => r.position.toFixed(1) },
  { key: 'change',      header: 'Δ Clicks',    align: 'right' as const, render: (r: GSCKeyword) => <ChangeCell value={r.change} /> },
]

const pageColumns = [
  { key: 'url',         header: 'Page',        render: (r: GSCPage) => <span className="font-medium text-accent">{r.url}</span> },
  { key: 'clicks',      header: 'Clicks',      align: 'right' as const, render: (r: GSCPage) => r.clicks.toLocaleString() },
  { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (r: GSCPage) => r.impressions.toLocaleString() },
  { key: 'ctr',         header: 'CTR',         align: 'right' as const, render: (r: GSCPage) => <span>{r.ctr.toFixed(2)}%</span> },
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
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['clicks', 'impressions'])
  const [activeTab, setActiveTab] = useState<'keywords' | 'pages'>('keywords')

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Clicks"
          value={gscSummary.totalClicks.toLocaleString()}
          change={gscSummary.clicksChange}
          icon={<MousePointerClick size={18} className="text-accent" />}
          iconBg="bg-accent-50"
        />
        <KPICard
          title="Total Impressions"
          value={(gscSummary.totalImpressions / 1_000_000).toFixed(2) + 'M'}
          change={gscSummary.impressionsChange}
          icon={<Eye size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Avg CTR"
          value={gscSummary.avgCtr.toFixed(2)}
          suffix="%"
          change={gscSummary.ctrChange}
          icon={<Search size={18} className="text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg Position"
          value={gscSummary.avgPosition.toFixed(1)}
          change={gscSummary.positionChange}
          changeLabel="vs last period (lower = better)"
          invertChange
          icon={<Crosshair size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Performance chart */}
      <div className="card p-5">
        <SectionHeader
          title="Search Performance"
          description="30-day trend across key metrics"
        />

        {/* Metric toggles */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {metricOptions.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                activeMetrics.includes(key)
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={activeMetrics.includes(key) ? { background: color, borderColor: color } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: activeMetrics.includes(key) ? 'white' : color }} />
              {label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={gscDailyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {activeMetrics.includes('clicks') && (
              <Line yAxisId="left" type="monotone" dataKey="clicks" stroke={ACCENT} strokeWidth={2} dot={false} name="Clicks" />
            )}
            {activeMetrics.includes('impressions') && (
              <Line yAxisId="right" type="monotone" dataKey="impressions" stroke={ACCENT2} strokeWidth={2} dot={false} name="Impressions" />
            )}
            {activeMetrics.includes('ctr') && (
              <Line yAxisId="left" type="monotone" dataKey="ctr" stroke={ACCENT3} strokeWidth={2} dot={false} name="CTR (%)" />
            )}
            {activeMetrics.includes('position') && (
              <Line yAxisId="left" type="monotone" dataKey="position" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Avg Position" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns: device + country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Device breakdown */}
        <div className="card p-5">
          <SectionHeader title="Device Breakdown" description="Clicks by device type" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={gscDeviceData}
                  dataKey="clicks"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                >
                  {gscDeviceData.map((_, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                  ))}
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
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: DEVICE_COLORS[i] }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Country breakdown */}
        <div className="card p-5">
          <SectionHeader title="Top Countries" description="Clicks by country" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gscCountryData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="clicks" fill={ACCENT} radius={[0, 4, 4, 0]} name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keywords & Pages table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['keywords', 'pages'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Top {tab === 'keywords' ? 'Queries' : 'Pages'}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>

        {activeTab === 'keywords' ? (
          <DataTable columns={keywordColumns} data={gscTopKeywords} rowKey="keyword" />
        ) : (
          <DataTable columns={pageColumns} data={gscTopPages} rowKey="url" />
        )}
      </div>
    </div>
  )
}
