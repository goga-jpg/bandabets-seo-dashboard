import { createContext, useContext, useState, ReactNode } from 'react'
import { format, subDays } from 'date-fns'

export type Country = 'All' | 'Nigeria' | 'Kenya' | 'Uganda' | 'Congo'

export interface DateRange {
  label: string
  days: number
  startDate?: string // ISO yyyy-MM-dd for custom ranges
  endDate?: string
  custom?: boolean
}

export const DATE_RANGES: DateRange[] = [
  { label: 'Last 7 days',  days: 7  },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
]

export const COUNTRIES: Country[] = ['All', 'Nigeria', 'Kenya', 'Uganda', 'Congo']

export const COUNTRY_MULTIPLIERS: Record<Country, number> = {
  All:     1.00,
  Nigeria: 0.35,
  Kenya:   0.25,
  Uganda:  0.22,
  Congo:   0.18,
}

interface FilterContextType {
  country: Country
  setCountry: (c: Country) => void
  dateRange: DateRange
  setDateRange: (d: DateRange) => void
  customStart: string
  customEnd: string
  setCustomStart: (d: string) => void
  setCustomEnd: (d: string) => void
  applyCustomRange: () => void
  displayLabel: string
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [country, setCountry]       = useState<Country>('All')
  const [dateRange, setDateRange]   = useState<DateRange>(DATE_RANGES[2])
  const [customStart, setCustomStart] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [customEnd,   setCustomEnd]   = useState(format(new Date(), 'yyyy-MM-dd'))

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return
    const start = new Date(customStart)
    const end   = new Date(customEnd)
    const days  = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
    setDateRange({
      label: `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`,
      days,
      startDate: customStart,
      endDate:   customEnd,
      custom: true,
    })
  }

  const displayLabel = dateRange.custom
    ? dateRange.label
    : dateRange.label

  return (
    <FilterContext.Provider value={{
      country, setCountry,
      dateRange, setDateRange,
      customStart, customEnd,
      setCustomStart, setCustomEnd,
      applyCustomRange,
      displayLabel,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}

export function scale(value: number, country: Country): number {
  return Math.round(value * COUNTRY_MULTIPLIERS[country])
}

export function sliceByDays<T>(data: T[], days: number): T[] {
  return data.slice(-Math.min(days, data.length))
}
