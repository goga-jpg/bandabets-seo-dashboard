import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'
import {
  countryGSCData,
  countryGA4Data,
  countrySummaryGSC,
  countrySummaryGA4,
} from '../../data/countryData'

const ACCENT = '#fa9602'

type CountryKey = keyof typeof countryGSCData

const COUNTRY_COORDS: Record<CountryKey, { lat: number; lng: number; zoom: number }> = {
  Nigeria: { lat: 9.0820,  lng: 8.6753,  zoom: 6 },
  Kenya:   { lat: -0.0236, lng: 37.9062, zoom: 6 },
  Uganda:  { lat: 1.3733,  lng: 32.2903, zoom: 6 },
  Congo:   { lat: -4.0383, lng: 21.7587, zoom: 5 },
}

interface LocationRow {
  country: CountryKey
  clicks: number
  sessions: number
  users: number
  coords: { lat: number; lng: number; zoom: number }
}

export default function LiveLocationMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})
  const [selected, setSelected] = useState<CountryKey | null>(null)

  const locations: LocationRow[] = useMemo(() => {
    return (Object.keys(COUNTRY_COORDS) as CountryKey[]).map((c) => ({
      country: c,
      clicks: countrySummaryGSC[c].totalClicks,
      sessions: countrySummaryGA4[c].totalSessions,
      users: countrySummaryGA4[c].totalUsers,
      coords: COUNTRY_COORDS[c],
    })).sort((a, b) => b.clicks + b.sessions - (a.clicks + a.sessions))
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = () => {
      if (cancelled) return
      if (!containerRef.current || typeof window.L === 'undefined') {
        setTimeout(init, 100)
        return
      }
      if (mapRef.current) return

      const L = window.L
      const map = L.map(containerRef.current, {
        center: [1.5, 25],
        zoom: 3,
        attributionControl: false,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      const maxClicks = Math.max(...locations.map((l) => l.clicks))
      locations.forEach((loc) => {
        const radius = 10 + (loc.clicks / maxClicks) * 18
        const marker = L.circleMarker([loc.coords.lat, loc.coords.lng], {
          radius,
          color: ACCENT,
          weight: 2,
          fillColor: ACCENT,
          fillOpacity: 0.45,
        })
          .addTo(map)
          .bindTooltip(
            `<strong>${loc.country}</strong><br/>` +
              `Clicks: ${loc.clicks.toLocaleString()}<br/>` +
              `Sessions: ${loc.sessions.toLocaleString()}`,
            { direction: 'top', offset: [0, -6] },
          )
          .on('click', () => flyTo(loc.country))

        markersRef.current[loc.country] = marker
      })

      mapRef.current = map
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = {}
      }
    }
  }, [locations])

  const flyTo = (country: CountryKey) => {
    const map = mapRef.current
    if (!map) return
    const { lat, lng, zoom } = COUNTRY_COORDS[country]
    map.flyTo([lat, lng], zoom, { duration: 1.1 })
    setSelected(country)
    const marker = markersRef.current[country]
    if (marker && marker.openTooltip) marker.openTooltip()
  }

  return (
    <div className="card p-5">
      <SectionHeader
        title="Live Locations"
        description="Countries reached via GSC + GA4 — click a country to zoom in"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative rounded-lg overflow-hidden border border-gray-100">
          <div ref={containerRef} style={{ height: 360, width: '100%' }} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Reached Locations
          </p>
          {locations.map((loc) => {
            const isActive = selected === loc.country
            return (
              <button
                key={loc.country}
                onClick={() => flyTo(loc.country)}
                className={`w-full text-left rounded-lg border px-3 py-2 flex items-center gap-3 transition-all ${
                  isActive
                    ? 'border-accent bg-accent-50'
                    : 'border-gray-100 hover:border-accent-200 hover:bg-accent-50/40'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-accent text-white' : 'bg-accent-50 text-accent'
                  }`}
                >
                  <MapPin size={14} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{loc.country}</p>
                  <p className="text-xs text-gray-500">
                    {loc.clicks.toLocaleString()} clicks · {loc.sessions.toLocaleString()} sessions
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
