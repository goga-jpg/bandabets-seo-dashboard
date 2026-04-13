import { useState } from 'react'
import {
  LayoutDashboard,
  Search,
  BarChart3,
  TrendingUp,
  Globe,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react'

export type ActiveView = 'overview' | 'gsc' | 'ga4'

interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

const navItems = [
  { id: 'overview' as ActiveView, icon: LayoutDashboard, label: 'Overview' },
  { id: 'gsc'      as ActiveView, icon: Search,          label: 'Search Console' },
  { id: 'ga4'      as ActiveView, icon: BarChart3,        label: 'Analytics (GA4)' },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-100 h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-100 shrink-0">
        <img
          src="https://touchvasgaming.b-cdn.net/banda/bandabetslogo.png"
          alt="BandaBets"
          className={`object-contain transition-all duration-300 ${collapsed ? 'h-8 w-8' : 'h-9 max-w-[140px]'}`}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 pt-2 pb-1">
            Analytics
          </p>
        )}
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`nav-item w-full ${activeView === id ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}

        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 pt-4 pb-1">
            More
          </p>
        )}
        <button
          className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Trends' : undefined}
        >
          <TrendingUp size={18} className="shrink-0" />
          {!collapsed && <span>Trends</span>}
        </button>
        <button
          className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Geo' : undefined}
        >
          <Globe size={18} className="shrink-0" />
          {!collapsed && <span>Geo Report</span>}
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-1 shrink-0">
        <button
          className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Help' : undefined}
        >
          <HelpCircle size={18} className="shrink-0" />
          {!collapsed && <span>Help</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:border-accent hover:text-accent transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
