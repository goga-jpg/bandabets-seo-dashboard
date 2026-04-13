import { useState } from 'react'
import { Users, Activity, Target, Clock, Smartphone, Monitor, Tablet } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import DataTable from '../common/DataTable'
import {
  ga4Summary, ga4DailyData, ga4Channels, ga4TopPages,
  ga4Events, ga4DeviceData, GA4Page, GA4Event, GA4Channel,
} from '../../data/ga4Data'

const ACCENT = '#fa9602'
const COLORS = ['#fa9602', '#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#6b7280']
const DEVICE_COLORS = [ACCENT, '#3b82f6', '#10b981']

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

const pageColumns = [
  { key: 'page',      header: 'Page',        render: (r: GA4Page) => <span className="font-medium text-accent">{r.page}</span> },
  { key: 'pageviews', header: 'Pageviews',   align: 'right' as const, render: (r: GA4Page) => r.pageviews.toLocaleString() },
  { key: 'users',     header: 'Users',       align: 'right' as const, render: (r: GA4Page) => r.users.toLocaleString() },
  { key: 'avgTime',   header: 'Avg Time',    align: 'right' as const },
  { key: 'bounceRate',header: 'Bounce Rate', align: 'right' as const, render: (r: GA4Page) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.bounceRate < 30 ? 'bg-emerald-50 text-emerald-600' : r.bounceRate < 40 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'}`}>
      {r.bounceRate}%
    </span>
  )},
]

const eventColumns = [
  { key: 'event', header: 'Event Name',  render: (r: GA4Event) => <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{r.event}</code> },
  { key: 'count', header: 'Event Count', align: 'right' as const, render: (r: GA4Event) => r.count.toLocaleString() },
  { key: 'users', header: 'Users',       align: 'right' as const, render: (r: GA4Event) => r.users.toLocaleString() },
  { key: 'change',header: 'Change',      align: 'right' as const, render: (r: GA4Event) => (
    <span className={`text-xs font-medium ${r.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
      {r.change >= 0 ? '+' : ''}{r.change}%
    </span>
  )},
]

type DailyMetric = 'sessions' | 'users' | 'newUsers' | 'conversions'

const metricOptions: { key: DailyMetric; label: string; color: string }[] = [
  { key: 'sessions',    label: 'Sessions',     color: ACCENT     },
  { key: 'users',       label: 'Users',        color: '#3b82f6'  },
  { key: 'newUsers',    label: 'New Users',    color: '#10b981'  },
  { key: 'conversions', label: 'Conversions',  color: '#8b5cf6'  },
]

export default function GA4Dashboard() {
  const [activeMetrics, setActiveMetrics] = useState<DailyMetric[]>(['sessions', 'users'])
  const [activeTab, setActiveTab] = useState<'pages' | 'events'>('pages')

  const toggleMetric = (key: DailyMetric) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Sessions"
          value={ga4Summary.totalSessions.toLocaleString()}
          change={ga4Summary.sessionsChange}
          icon={<Activity size={18} className="text-accent" />}
          iconBg="bg-accent-50"
        />
        <KPICard
          title="Total Users"
          value={ga4Summary.totalUsers.toLocaleString()}
          change={ga4Summary.usersChange}
          icon={<Users size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Conversions"
          value={ga4Summary.totalConversions.toLocaleString()}
          change={ga4Summary.conversionsChange}
          icon={<Target size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Bounce Rate"
          value={ga4Summary.avgBounceRate.toFixed(1)}
          suffix="%"
          change={ga4Summary.bounceRateChange}
          changeLabel="vs last period (lower = better)"
          invertChange
          icon={<Clock size={18} className="text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Sessions trend */}
      <div className="card p-5">
        <SectionHeader title="Traffic Trend" description="30-day sessions & users" />

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
          <LineChart data={ga4DailyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {metricOptions.map(({ key, label, color }) =>
              activeMetrics.includes(key) ? (
                <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} name={label} />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Channel + device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Channel breakdown */}
        <div className="card p-5">
          <SectionHeader title="Channel Breakdown" description="Sessions by acquisition channel" />
          <div className="space-y-3">
            {ga4Channels.map((ch: GA4Channel) => {
              const total = ga4Channels.reduce((s, x) => s + x.sessions, 0)
              const pct = ((ch.sessions / total) * 100).toFixed(1)
              return (
                <div key={ch.channel}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{ch.channel}</span>
                    <div className="flex gap-4">
                      <span className="text-gray-500">{ch.sessions.toLocaleString()} sessions</span>
                      <span className="font-semibold text-gray-700">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ch.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Device split */}
        <div className="card p-5">
          <SectionHeader title="Device Split" description="Sessions by device category" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={ga4DeviceData} dataKey="sessions" nameKey="device" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {ga4DeviceData.map((_, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 flex-1">
              {ga4DeviceData.map((d, i) => {
                const Icon = d.device === 'Mobile' ? Smartphone : d.device === 'Desktop' ? Monitor : Tablet
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    <Icon size={14} style={{ color: DEVICE_COLORS[i] }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{d.device}</span>
                        <span className="font-semibold">{d.share}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.share}%`, background: DEVICE_COLORS[i] }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion by channel bar chart */}
      <div className="card p-5">
        <SectionHeader title="Conversion Rate by Channel" description="Conversion % per acquisition source" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ga4Channels} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="convRate" name="Conv. Rate" radius={[4, 4, 0, 0]}>
              {ga4Channels.map((ch, i) => (
                <Cell key={i} fill={ch.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pages & events table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['pages', 'events'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Top {tab === 'pages' ? 'Pages' : 'Events'}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        {activeTab === 'pages' ? (
          <DataTable columns={pageColumns} data={ga4TopPages} rowKey="page" />
        ) : (
          <DataTable columns={eventColumns} data={ga4Events} rowKey="event" />
        )}
      </div>
    </div>
  )
}
