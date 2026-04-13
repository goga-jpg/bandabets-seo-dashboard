import { useState } from 'react'
import {
  LayoutDashboard, Search, BarChart3, TrendingUp,
  Globe, ChevronLeft, ChevronRight, Settings, HelpCircle,
  Smartphone, Monitor, Crosshair, Sparkles, FileSearch,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export type ActiveView =
  | 'overview'
  | 'gsc'
  | 'ga4'
  | 'yandex'
  | 'yandex-webmaster'
  | 'bing'
  | 'clarity'
  | 'apk'
  | 'trends'
  | 'insights'

interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

const analyticsNav = [
  { id: 'overview'          as ActiveView, icon: LayoutDashboard, label: 'Overview'           },
  { id: 'gsc'               as ActiveView, icon: Search,          label: 'Search Console'      },
  { id: 'ga4'               as ActiveView, icon: BarChart3,       label: 'GA4 Analytics'       },
  { id: 'yandex'            as ActiveView, icon: Globe,           label: 'Yandex Metrica'      },
  { id: 'yandex-webmaster'  as ActiveView, icon: FileSearch,      label: 'Yandex Webmaster'    },
  { id: 'bing'              as ActiveView, icon: Crosshair,       label: 'Bing Webmaster'      },
  { id: 'clarity'           as ActiveView, icon: Monitor,         label: 'MS Clarity'          },
]

const toolsNav = [
  { id: 'apk'      as ActiveView, icon: Smartphone,  label: 'APK Downloads'  },
  { id: 'trends'   as ActiveView, icon: TrendingUp,  label: 'Trends'         },
  { id: 'insights' as ActiveView, icon: Sparkles,    label: 'AI Insights'    },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()

  const NavItem = ({ id, icon: Icon, label }: { id: ActiveView; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => onViewChange(id)}
      className={`nav-item w-full ${activeView === id ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
      {!collapsed && id === 'insights' && (
        <span className="ml-auto text-[10px] font-semibold bg-accent text-white px-1.5 py-0.5 rounded-full">AI</span>
      )}
    </button>
  )

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-100 h-screen transition-all duration-300 shrink-0 ${
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
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 pt-2 pb-1.5">
            Analytics
          </p>
        )}
        {collapsed && <div className="h-3" />}

        {analyticsNav.map((item) => <NavItem key={item.id} {...item} />)}

        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 pt-4 pb-1.5">
            Tools
          </p>
        )}
        {collapsed && <div className="h-3" />}

        {toolsNav.map((item) => <NavItem key={item.id} {...item} />)}
      </nav>

      {/* User + bottom */}
      <div className="p-3 border-t border-gray-100 space-y-1 shrink-0">
        {!collapsed && user && (
          <div className="px-4 py-2 mb-1">
            <p className="text-xs font-semibold text-gray-700 truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <button className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? 'Settings' : undefined}>
          <Settings size={17} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? 'Help' : undefined}>
          <HelpCircle size={17} className="shrink-0" />
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
