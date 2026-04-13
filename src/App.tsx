import { useState } from 'react'
import Sidebar, { ActiveView } from './components/layout/Sidebar'
import Header from './components/layout/Header'
import OverviewDashboard from './components/overview/OverviewDashboard'
import GSCDashboard from './components/gsc/GSCDashboard'
import GA4Dashboard from './components/ga4/GA4Dashboard'

const viewConfig: Record<ActiveView, { title: string; subtitle: string }> = {
  overview: {
    title: 'Analytics Overview',
    subtitle: 'Combined view of Search Console & GA4 · Mar 14 – Apr 12, 2025',
  },
  gsc: {
    title: 'Google Search Console',
    subtitle: 'Search performance, queries & pages · Mar 14 – Apr 12, 2025',
  },
  ga4: {
    title: 'Google Analytics 4',
    subtitle: 'Traffic, behaviour & conversions · Mar 14 – Apr 12, 2025',
  },
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview')
  const { title, subtitle } = viewConfig[activeView]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'overview' && <OverviewDashboard />}
          {activeView === 'gsc'      && <GSCDashboard />}
          {activeView === 'ga4'      && <GA4Dashboard />}
        </main>
      </div>
    </div>
  )
}
