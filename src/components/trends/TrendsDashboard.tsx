import { TrendingUp, Globe2, Flame, ArrowUpRight } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'
import SectionHeader from '../common/SectionHeader'
import { trendsKeywords, trendsByCountry, relatedTopics } from '../../data/trendsData'
import { useFilters } from '../../context/FilterContext'

const COLORS = ['#fa9602', '#3b82f6', '#10b981', '#8b5cf6']

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

// Merge all keyword trend data into a single series for the chart
const mergedTrends = trendsKeywords[0].data.map((_, i) => {
  const row: Record<string, string | number> = { week: trendsKeywords[0].data[i].week }
  trendsKeywords.forEach((kw) => {
    row[kw.keyword] = kw.data[i].interest
  })
  return row
})

export default function TrendsDashboard() {
  const { country } = useFilters()

  const filteredCountry = country !== 'All'
    ? trendsByCountry.filter((t) => t.country === country)
    : trendsByCountry

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
          Google Trends
        </span>
        {country !== 'All' && (
          <span className="bg-accent-50 text-accent text-xs font-medium px-3 py-1 rounded-full">{country}</span>
        )}
      </div>

      {/* Keyword interest cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {trendsKeywords.map((kw, i) => (
          <div key={kw.keyword} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 leading-tight">{kw.keyword}</p>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                +{kw.change}%
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: COLORS[i] }}>
              {kw.data[kw.data.length - 1].interest}
            </p>
            <p className="text-xs text-gray-400">/ 100 interest</p>
          </div>
        ))}
      </div>

      {/* Trend lines */}
      <div className="card p-5">
        <SectionHeader title="Search Interest Over Time" description="Relative interest score (0–100) from Google Trends" />
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={mergedTrends} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            {trendsKeywords.map((kw, i) => (
              <Line
                key={kw.keyword}
                type="monotone"
                dataKey={kw.keyword}
                stroke={kw.color}
                strokeWidth={2}
                dot={{ r: 4, fill: kw.color }}
                name={kw.keyword}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {trendsKeywords.map((kw) => (
            <div key={kw.keyword} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3 h-0.5 rounded" style={{ background: kw.color, display: 'inline-block' }} />
              {kw.keyword}
            </div>
          ))}
        </div>
      </div>

      {/* By country + related topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <SectionHeader title="Interest by Country" description="Search interest for 'banda bets'" />
          <div className="space-y-3 mt-2">
            {filteredCountry.map((c, i) => (
              <div key={c.country}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <Globe2 size={13} className="text-gray-400" />
                    <span className="text-gray-700 font-medium">{c.country}</span>
                    <span className="text-emerald-600 text-xs font-medium">+{c.change}%</span>
                  </div>
                  <span className="font-semibold text-gray-800">{c.interest} / 100</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.interest}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Related Topics & Queries" description="Breakout and top searches" />
          <div className="space-y-2">
            {relatedTopics.map((t) => (
              <div key={t.topic} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  {t.type === 'Rising' ? (
                    <Flame size={13} className="text-orange-500" />
                  ) : (
                    <TrendingUp size={13} className="text-blue-500" />
                  )}
                  <span className="text-sm text-gray-700">{t.topic}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    t.type === 'Rising' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {t.value}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    t.type === 'Rising' ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {t.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
