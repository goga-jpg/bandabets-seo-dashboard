import { createContext, useContext, useState, ReactNode } from 'react'

export type Country = 'All' | 'Nigeria' | 'Kenya' | 'Uganda' | 'Congo'

export interface DateRange {
  label: string
  days: number
}

export const DATE_RANGES: DateRange[] = [
  { label: 'Last 7 days',  days: 7  },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
]

export const COUNTRIES: Country[] = ['All', 'Nigeria', 'Kenya', 'Uganda', 'Congo']

// How each country scales global metrics (share of total)
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
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>('All')
  const [dateRange, setDateRange] = useState<DateRange>(DATE_RANGES[2])

  return (
    <FilterContext.Provider value={{ country, setCountry, dateRange, setDateRange }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}

/** Scale a number by country multiplier */
export function scale(value: number, country: Country): number {
  return Math.round(value * COUNTRY_MULTIPLIERS[country])
}

/** Slice daily data to selected date range */
export function sliceByDays<T>(data: T[], days: number): T[] {
  return data.slice(-days)
}
