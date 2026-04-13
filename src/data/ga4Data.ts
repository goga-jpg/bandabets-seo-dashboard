export interface GA4DailyMetric {
  date: string
  sessions: number
  users: number
  newUsers: number
  bounceRate: number
  avgDuration: number
  conversions: number
}

export interface GA4Channel {
  channel: string
  sessions: number
  users: number
  conversions: number
  convRate: number
  color: string
}

export interface GA4Page {
  page: string
  pageviews: number
  users: number
  avgTime: string
  bounceRate: number
}

export interface GA4Event {
  event: string
  count: number
  users: number
  change: number
}

export const ga4Summary = {
  totalSessions:    124_680,
  totalUsers:        98_420,
  newUsers:          72_840,
  avgBounceRate:      38.4,
  avgSessionDuration: '4:12',
  totalConversions:   8_640,
  sessionsChange:    18.6,
  usersChange:       15.2,
  conversionsChange: 22.4,
  bounceRateChange:  -3.8,
}

export const ga4DailyData: GA4DailyMetric[] = [
  { date: 'Mar 14', sessions: 3820, users: 3120, newUsers: 2340, bounceRate: 40.2, avgDuration: 238, conversions: 248 },
  { date: 'Mar 15', sessions: 4140, users: 3380, newUsers: 2540, bounceRate: 39.8, avgDuration: 242, conversions: 268 },
  { date: 'Mar 16', sessions: 3960, users: 3240, newUsers: 2420, bounceRate: 40.6, avgDuration: 235, conversions: 256 },
  { date: 'Mar 17', sessions: 2840, users: 2340, newUsers: 1760, bounceRate: 43.2, avgDuration: 218, conversions: 184 },
  { date: 'Mar 18', sessions: 2620, users: 2160, newUsers: 1620, bounceRate: 44.0, avgDuration: 212, conversions: 170 },
  { date: 'Mar 19', sessions: 4280, users: 3480, newUsers: 2620, bounceRate: 39.4, avgDuration: 248, conversions: 278 },
  { date: 'Mar 20', sessions: 4460, users: 3620, newUsers: 2720, bounceRate: 38.8, avgDuration: 252, conversions: 290 },
  { date: 'Mar 21', sessions: 4380, users: 3560, newUsers: 2680, bounceRate: 38.6, avgDuration: 254, conversions: 284 },
  { date: 'Mar 22', sessions: 4240, users: 3460, newUsers: 2600, bounceRate: 39.0, avgDuration: 248, conversions: 275 },
  { date: 'Mar 23', sessions: 4120, users: 3360, newUsers: 2520, bounceRate: 39.4, avgDuration: 244, conversions: 267 },
  { date: 'Mar 24', sessions: 2980, users: 2440, newUsers: 1840, bounceRate: 42.6, avgDuration: 224, conversions: 193 },
  { date: 'Mar 25', sessions: 2740, users: 2260, newUsers: 1700, bounceRate: 43.4, avgDuration: 218, conversions: 178 },
  { date: 'Mar 26', sessions: 4580, users: 3720, newUsers: 2800, bounceRate: 38.2, avgDuration: 256, conversions: 297 },
  { date: 'Mar 27', sessions: 4720, users: 3840, newUsers: 2880, bounceRate: 37.8, avgDuration: 260, conversions: 306 },
  { date: 'Mar 28', sessions: 4640, users: 3780, newUsers: 2840, bounceRate: 38.0, avgDuration: 258, conversions: 301 },
  { date: 'Mar 29', sessions: 4800, users: 3900, newUsers: 2940, bounceRate: 37.4, avgDuration: 262, conversions: 312 },
  { date: 'Mar 30', sessions: 4560, users: 3720, newUsers: 2800, bounceRate: 38.2, avgDuration: 255, conversions: 296 },
  { date: 'Mar 31', sessions: 3180, users: 2600, newUsers: 1960, bounceRate: 41.6, avgDuration: 228, conversions: 207 },
  { date: 'Apr 01', sessions: 2920, users: 2400, newUsers: 1800, bounceRate: 42.4, avgDuration: 220, conversions: 190 },
  { date: 'Apr 02', sessions: 4960, users: 4020, newUsers: 3040, bounceRate: 37.0, avgDuration: 265, conversions: 322 },
  { date: 'Apr 03', sessions: 5080, users: 4120, newUsers: 3120, bounceRate: 36.8, avgDuration: 268, conversions: 330 },
  { date: 'Apr 04', sessions: 4920, users: 3980, newUsers: 3000, bounceRate: 37.2, avgDuration: 264, conversions: 319 },
  { date: 'Apr 05', sessions: 4860, users: 3940, newUsers: 2960, bounceRate: 37.4, avgDuration: 261, conversions: 315 },
  { date: 'Apr 06', sessions: 4720, users: 3840, newUsers: 2880, bounceRate: 37.8, avgDuration: 257, conversions: 306 },
  { date: 'Apr 07', sessions: 3280, users: 2680, newUsers: 2020, bounceRate: 41.2, avgDuration: 232, conversions: 213 },
  { date: 'Apr 08', sessions: 3040, users: 2480, newUsers: 1870, bounceRate: 41.8, avgDuration: 225, conversions: 197 },
  { date: 'Apr 09', sessions: 5200, users: 4220, newUsers: 3180, bounceRate: 36.4, avgDuration: 271, conversions: 338 },
  { date: 'Apr 10', sessions: 5360, users: 4340, newUsers: 3280, bounceRate: 36.0, avgDuration: 274, conversions: 348 },
  { date: 'Apr 11', sessions: 5160, users: 4180, newUsers: 3160, bounceRate: 36.6, avgDuration: 270, conversions: 335 },
  { date: 'Apr 12', sessions: 5240, users: 4260, newUsers: 3220, bounceRate: 36.2, avgDuration: 272, conversions: 340 },
]

export const ga4Channels: GA4Channel[] = [
  { channel: 'Organic Search', sessions: 48420, users: 38640, conversions: 3360, convRate: 6.94, color: '#fa9602' },
  { channel: 'Direct',         sessions: 28640, users: 24180, conversions: 2180, convRate: 7.61, color: '#f97316' },
  { channel: 'Paid Search',    sessions: 18420, users: 14820, conversions: 1420, convRate: 7.71, color: '#3b82f6' },
  { channel: 'Social',         sessions: 14280, users: 11640, conversions: 840,  convRate: 5.88, color: '#8b5cf6' },
  { channel: 'Referral',       sessions: 9840,  users: 7960,  conversions: 620,  convRate: 6.30, color: '#10b981' },
  { channel: 'Email',          sessions: 4120,  users: 3420,  conversions: 480,  convRate: 11.65, color: '#ec4899' },
  { channel: 'Other',          sessions: 960,   users: 780,   conversions: 52,   convRate: 5.42, color: '#6b7280' },
]

export const ga4TopPages: GA4Page[] = [
  { page: '/',                    pageviews: 38640, users: 32480, avgTime: '1:42', bounceRate: 34.2 },
  { page: '/sports/football',     pageviews: 24180, users: 19840, avgTime: '5:28', bounceRate: 28.6 },
  { page: '/live-betting',        pageviews: 18940, users: 15620, avgTime: '8:14', bounceRate: 22.4 },
  { page: '/casino',              pageviews: 16280, users: 13240, avgTime: '6:52', bounceRate: 30.8 },
  { page: '/promotions',          pageviews: 12640, users: 10480, avgTime: '3:18', bounceRate: 42.6 },
  { page: '/register',            pageviews: 10820, users: 9640,  avgTime: '2:44', bounceRate: 24.2 },
  { page: '/sports/cricket',      pageviews: 9640,  users: 7980,  avgTime: '4:56', bounceRate: 31.4 },
  { page: '/app-download',        pageviews: 8420,  users: 7140,  avgTime: '2:22', bounceRate: 38.8 },
  { page: '/blog/betting-tips',   pageviews: 7840,  users: 6680,  avgTime: '7:36', bounceRate: 35.6 },
  { page: '/account/deposit',     pageviews: 6820,  users: 5940,  avgTime: '3:48', bounceRate: 18.2 },
]

export const ga4Events: GA4Event[] = [
  { event: 'register_complete',  count: 8640,  users: 8640,  change: 22.4 },
  { event: 'first_deposit',      count: 6480,  users: 6320,  change: 18.6 },
  { event: 'bet_placed',         count: 284600, users: 42840, change: 24.8 },
  { event: 'live_bet_placed',    count: 98420,  users: 28640, change: 31.2 },
  { event: 'app_download',       count: 4280,   users: 4280,  change: 44.6 },
  { event: 'promotion_claimed',  count: 12640,  users: 9840,  change: 12.8 },
  { event: 'search_used',        count: 42180,  users: 24680, change: 8.4  },
  { event: 'video_play',         count: 18420,  users: 12640, change: 56.2 },
]

export const ga4DeviceData = [
  { device: 'Mobile',  sessions: 84240, users: 66840, share: 67.6 },
  { device: 'Desktop', sessions: 31680, users: 24840, share: 25.4 },
  { device: 'Tablet',  sessions: 8760,  users: 6740,  share: 7.0  },
]
