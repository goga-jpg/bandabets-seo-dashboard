import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: ReactNode
  iconBg?: string
  suffix?: string
  invertChange?: boolean // for metrics where lower is better (e.g., bounce rate)
}

export default function KPICard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  iconBg = 'bg-accent-50',
  suffix,
  invertChange = false,
}: KPICardProps) {
  const isPositive = invertChange ? (change ?? 0) < 0 : (change ?? 0) > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`${iconBg} rounded-lg p-2`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {isNeutral ? (
              <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                <Minus size={10} />
                {Math.abs(change)}%
              </span>
            ) : isPositive ? (
              <span className="metric-up flex items-center gap-1">
                <TrendingUp size={10} />
                {Math.abs(change)}%
              </span>
            ) : (
              <span className="metric-down flex items-center gap-1">
                <TrendingDown size={10} />
                {Math.abs(change)}%
              </span>
            )}
            <span className="text-xs text-gray-400">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
