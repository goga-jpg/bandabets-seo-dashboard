import { useState, useRef, useEffect } from 'react'
import { Bell, RefreshCw, ChevronDown, LogOut, Globe, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFilters, COUNTRIES, DATE_RANGES, Country, DateRange } from '../../context/FilterContext'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { country, setCountry, dateRange, setDateRange } = useFilters()

  const [showCountry, setShowCountry]   = useState(false)
  const [showDate, setShowDate]         = useState(false)
  const [showUser, setShowUser]         = useState(false)

  const countryRef = useRef<HTMLDivElement>(null)
  const dateRef    = useRef<HTMLDivElement>(null)
  const userRef    = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setShowCountry(false)
      if (dateRef.current    && !dateRef.current.contains(e.target as Node))    setShowDate(false)
      if (userRef.current    && !userRef.current.contains(e.target as Node))    setShowUser(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'BB'

  return (
    <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">

        {/* Country filter */}
        <div className="relative" ref={countryRef}>
          <button
            onClick={() => { setShowCountry(!showCountry); setShowDate(false); setShowUser(false) }}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-accent transition-colors"
          >
            <Globe size={13} className="text-accent" />
            <span>{country}</span>
            <ChevronDown size={12} />
          </button>
          {showCountry && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50 min-w-[130px]">
              {COUNTRIES.map((c: Country) => (
                <button
                  key={c}
                  onClick={() => { setCountry(c); setShowCountry(false) }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    country === c ? 'font-medium text-accent' : 'text-gray-700'
                  }`}
                >
                  {c === 'All' ? 'All Countries' : c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date range filter */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => { setShowDate(!showDate); setShowCountry(false); setShowUser(false) }}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-accent transition-colors"
          >
            <Calendar size={13} className="text-accent" />
            <span>{dateRange.label}</span>
            <ChevronDown size={12} />
          </button>
          {showDate && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50 min-w-[150px]">
              {DATE_RANGES.map((d: DateRange) => (
                <button
                  key={d.days}
                  onClick={() => { setDateRange(d); setShowDate(false) }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    dateRange.days === d.days ? 'font-medium text-accent' : 'text-gray-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh */}
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-accent transition-colors" title="Refresh data">
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-accent transition-colors" title="Notifications">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUser(!showUser); setShowCountry(false); setShowDate(false) }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown size={12} className="text-gray-400" />
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 min-w-[200px]">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
