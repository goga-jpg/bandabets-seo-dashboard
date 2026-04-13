import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'
import LoginPage from './components/auth/LoginPage'
import Sidebar, { ActiveView } from './components/layout/Sidebar'
import Header from './components/layout/Header'
import OverviewDashboard from './components/overview/OverviewDashboard'
import GSCDashboard from './components/gsc/GSCDashboard'
import GA4Dashboard from './components/ga4/GA4Dashboard'
import YandexDashboard from './components/yandex/YandexDashboard'
import YandexWebmasterDashboard from './components/yandex/YandexWebmasterDashboard'
import BingDashboard from './components/bing/BingDashboard'
import ClarityDashboard from './components/clarity/ClarityDashboard'
import APKDashboard from './components/apk/APKDashboard'
import TrendsDashboard from './components/trends/TrendsDashboard'
import AIInsights from './components/insights/AIInsights'
import PageInsightsDashboard from './components/pages/PageInsightsDashboard'
import UserManagement from './components/admin/UserManagement'
import UserProfile from './components/profile/UserProfile'

const viewConfig: Record<ActiveView, { title: string; subtitle: string }> = {
  overview:           { title: 'Analytics Overview',       subtitle: 'Combined KPIs across all platforms'                        },
  gsc:                { title: 'Google Search Console',    subtitle: 'Organic search performance, queries & pages'               },
  ga4:                { title: 'Google Analytics 4',       subtitle: 'Traffic, behaviour & conversions'                          },
  'page-insights':    { title: 'Page Insights',            subtitle: 'Per-page SEO health, Core Web Vitals & opportunities'      },
  yandex:             { title: 'Yandex Metrica',           subtitle: 'Visits, goals & traffic sources'                           },
  'yandex-webmaster': { title: 'Yandex Webmaster',         subtitle: 'Index coverage, crawl health & Yandex search queries'      },
  bing:               { title: 'Bing Webmaster Tools',     subtitle: 'Bing search performance & index health'                    },
  clarity:            { title: 'Microsoft Clarity',        subtitle: 'Session recordings, heatmaps & UX signals'                 },
  apk:                { title: 'APK Downloads',            subtitle: 'App installs, versions & ratings by country'               },
  trends:             { title: 'Google Trends',            subtitle: 'Search interest over time & related queries'               },
  insights:           { title: 'AI Insights',              subtitle: 'Automated analysis & recommendations from your data'       },
  users:              { title: 'Manage Users',             subtitle: 'Invite team members and manage access roles'               },
  profile:            { title: 'My Profile',               subtitle: 'Update your display name, photo and account details'       },
}

function WelcomeBanner({ name }: { name: string }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="bg-accent-50 border border-accent-200 rounded-xl px-5 py-3 flex items-center justify-between mb-4">
      <p className="text-sm text-accent-800 font-medium">
        Welcome back, <span className="font-bold">{name}</span>! Here's your latest analytics overview.
      </p>
      <button onClick={() => setDismissed(true)} className="text-accent hover:text-accent-700 text-lg leading-none ml-4">×</button>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState<ActiveView>('overview')
  const { title, subtitle } = viewConfig[activeView]

  return (
    <FilterProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 overflow-y-auto p-6">
            {activeView === 'overview'          && user && <WelcomeBanner name={user.name} />}
            {activeView === 'overview'          && <OverviewDashboard />}
            {activeView === 'gsc'               && <GSCDashboard />}
            {activeView === 'ga4'               && <GA4Dashboard />}
            {activeView === 'page-insights'     && <PageInsightsDashboard />}
            {activeView === 'yandex'            && <YandexDashboard />}
            {activeView === 'yandex-webmaster'  && <YandexWebmasterDashboard />}
            {activeView === 'bing'              && <BingDashboard />}
            {activeView === 'clarity'           && <ClarityDashboard />}
            {activeView === 'apk'               && <APKDashboard />}
            {activeView === 'trends'            && <TrendsDashboard />}
            {activeView === 'insights'          && <AIInsights />}
            {activeView === 'users'             && <UserManagement />}
            {activeView === 'profile'           && <UserProfile />}
          </main>
        </div>
      </div>
    </FilterProvider>
  )
}

function AppInner() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <Dashboard /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
