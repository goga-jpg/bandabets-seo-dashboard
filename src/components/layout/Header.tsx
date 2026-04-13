import { Bell, RefreshCw, Calendar } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Date range badge */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:border-accent transition-colors">
          <Calendar size={14} className="text-accent" />
          <span>Mar 14 – Apr 12, 2025</span>
        </div>

        {/* Refresh */}
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-accent transition-colors" title="Refresh data">
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-accent transition-colors" title="Notifications">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
          BB
        </div>
      </div>
    </header>
  )
}
