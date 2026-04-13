import { Download, Smartphone, RefreshCcw } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import KPICard from '../common/KPICard'
import SectionHeader from '../common/SectionHeader'
import { apkSummary, apkDaily, apkByCountry, apkVersions } from '../../data/apkData'
import { useFilters, scale, sliceByDays } from '../../context/FilterContext'

const ACCENT = '#fa9602'
const ANDROID_COLOR = '#34a853'
const IOS_COLOR     = '#007aff'

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


export default function APKDashboard() {
  const { country, dateRange } = useFilters()

  // For country filter on APK: show that country's row, else totals
  const countryRow = country !== 'All'
    ? apkByCountry.find((r) => r.country === country)
    : null

  const totalDownloads   = countryRow ? countryRow.total    : apkSummary.totalDownloads
  const androidDownloads = countryRow ? countryRow.android  : apkSummary.androidDownloads
  const iosDownloads     = countryRow ? countryRow.ios      : apkSummary.iosDownloads
  const activeInstalls   = countryRow
    ? Math.round(countryRow.total * 0.68)
    : apkSummary.activeInstalls

  const daily = sliceByDays(apkDaily, dateRange.days)

  const countryColumns = [
    { key: 'country', header: 'Country', render: (r: typeof apkByCountry[0]) => <span className="font-medium text-gray-800">{r.country}</span> },
    { key: 'android', header: 'Android', align: 'right' as const, render: (r: typeof apkByCountry[0]) => r.android.toLocaleString() },
    { key: 'ios',     header: 'iOS',     align: 'right' as const, render: (r: typeof apkByCountry[0]) => r.ios.toLocaleString() },
    { key: 'total',   header: 'Total',   align: 'right' as const, render: (r: typeof apkByCountry[0]) => <span className="font-semibold">{r.total.toLocaleString()}</span> },
  ]

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
          APK Downloads
        </span>
        {country !== 'All' && (
          <span className="bg-accent-50 text-accent text-xs font-medium px-3 py-1 rounded-full">{country}</span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Downloads"  value={totalDownloads.toLocaleString()}   change={apkSummary.downloadsChange}  icon={<Download   size={18} className="text-accent" />}       iconBg="bg-accent-50"  />
        <KPICard title="Android"          value={androidDownloads.toLocaleString()} icon={<Smartphone size={18} className="text-green-600" />}  iconBg="bg-green-50"  />
        <KPICard title="iOS"              value={iosDownloads.toLocaleString()}      icon={<Smartphone size={18} className="text-blue-500" />}   iconBg="bg-blue-50"   />
        <KPICard title="Active Installs"  value={activeInstalls.toLocaleString()}   change={apkSummary.activeChange}     icon={<RefreshCcw size={18} className="text-purple-500" />} iconBg="bg-purple-50" />
      </div>

      {/* Download trend */}
      <div className="card p-5">
        <SectionHeader title="Download Trend" description={`${dateRange.label} · Android vs iOS`} />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={daily} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={Math.floor(daily.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="android" stroke={ANDROID_COLOR} strokeWidth={2} dot={false} name="Android" />
            <Line type="monotone" dataKey="ios"     stroke={IOS_COLOR}     strokeWidth={2} dot={false} name="iOS" />
            <Line type="monotone" dataKey="total"   stroke={ACCENT}        strokeWidth={2} dot={false} name="Total" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* By country + versions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Downloads by Country" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={apkByCountry} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="android" fill={ANDROID_COLOR} name="Android" stackId="a" radius={[0,0,0,0]} />
              <Bar dataKey="ios"     fill={IOS_COLOR}     name="iOS"     stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="App Version Distribution" />
          <div className="space-y-3 mt-2">
            {apkVersions.map((v) => (
              <div key={v.version}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">{v.version}</span>
                  <span className="text-gray-500">{v.installs.toLocaleString()} installs · <span className="font-semibold">{v.pct}%</span></span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: ACCENT }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
