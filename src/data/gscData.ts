export interface GSCDailyMetric {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCKeyword {
  keyword: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  change: number
}

export interface GSCPage {
  url: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCDevice {
  device: string
  clicks: number
  impressions: number
  ctr: number
}

export const gscSummary = {
  totalClicks: 48_320,
  totalImpressions: 1_245_800,
  avgCtr: 3.88,
  avgPosition: 14.2,
  clicksChange: 12.4,
  impressionsChange: 8.7,
  ctrChange: 3.2,
  positionChange: -1.8, // negative = improved
}

export const gscDailyData: GSCDailyMetric[] = [
  { date: 'Mar 14', clicks: 1420, impressions: 38500, ctr: 3.69, position: 15.1 },
  { date: 'Mar 15', clicks: 1550, impressions: 40200, ctr: 3.86, position: 14.9 },
  { date: 'Mar 16', clicks: 1380, impressions: 37800, ctr: 3.65, position: 15.3 },
  { date: 'Mar 17', clicks: 980,  impressions: 28600, ctr: 3.43, position: 15.8 },
  { date: 'Mar 18', clicks: 870,  impressions: 26200, ctr: 3.32, position: 16.1 },
  { date: 'Mar 19', clicks: 1640, impressions: 41800, ctr: 3.92, position: 14.7 },
  { date: 'Mar 20', clicks: 1720, impressions: 43600, ctr: 3.94, position: 14.5 },
  { date: 'Mar 21', clicks: 1680, impressions: 42900, ctr: 3.92, position: 14.4 },
  { date: 'Mar 22', clicks: 1590, impressions: 41200, ctr: 3.86, position: 14.6 },
  { date: 'Mar 23', clicks: 1480, impressions: 39400, ctr: 3.76, position: 14.8 },
  { date: 'Mar 24', clicks: 1020, impressions: 30100, ctr: 3.39, position: 15.5 },
  { date: 'Mar 25', clicks: 940,  impressions: 27900, ctr: 3.37, position: 15.7 },
  { date: 'Mar 26', clicks: 1780, impressions: 44500, ctr: 4.00, position: 14.2 },
  { date: 'Mar 27', clicks: 1820, impressions: 45200, ctr: 4.03, position: 14.0 },
  { date: 'Mar 28', clicks: 1760, impressions: 44100, ctr: 3.99, position: 14.1 },
  { date: 'Mar 29', clicks: 1840, impressions: 45800, ctr: 4.02, position: 13.9 },
  { date: 'Mar 30', clicks: 1690, impressions: 42600, ctr: 3.97, position: 14.1 },
  { date: 'Mar 31', clicks: 1100, impressions: 31200, ctr: 3.53, position: 14.8 },
  { date: 'Apr 01', clicks: 980,  impressions: 28400, ctr: 3.45, position: 15.0 },
  { date: 'Apr 02', clicks: 1920, impressions: 47200, ctr: 4.07, position: 13.8 },
  { date: 'Apr 03', clicks: 1960, impressions: 48100, ctr: 4.07, position: 13.7 },
  { date: 'Apr 04', clicks: 1880, impressions: 46800, ctr: 4.02, position: 13.9 },
  { date: 'Apr 05', clicks: 1820, impressions: 45600, ctr: 3.99, position: 14.0 },
  { date: 'Apr 06', clicks: 1750, impressions: 44200, ctr: 3.96, position: 14.1 },
  { date: 'Apr 07', clicks: 1140, impressions: 32600, ctr: 3.50, position: 14.6 },
  { date: 'Apr 08', clicks: 1060, impressions: 30400, ctr: 3.49, position: 14.8 },
  { date: 'Apr 09', clicks: 2010, impressions: 49400, ctr: 4.07, position: 13.6 },
  { date: 'Apr 10', clicks: 2080, impressions: 50800, ctr: 4.09, position: 13.5 },
  { date: 'Apr 11', clicks: 1990, impressions: 48900, ctr: 4.07, position: 13.6 },
  { date: 'Apr 12', clicks: 2040, impressions: 49800, ctr: 4.10, position: 13.4 },
]

export const gscTopKeywords: GSCKeyword[] = [
  { keyword: 'banda bets',                   clicks: 8420,  impressions: 124000, ctr: 6.79, position:  2.1, change:  340 },
  { keyword: 'online sports betting',        clicks: 4180,  impressions:  98500, ctr: 4.24, position:  8.4, change:  210 },
  { keyword: 'banda bets login',             clicks: 3960,  impressions:  52400, ctr: 7.56, position:  1.8, change:  180 },
  { keyword: 'sports betting south africa',  clicks: 2840,  impressions:  87600, ctr: 3.24, position: 11.2, change:  -90 },
  { keyword: 'bet on football',              clicks: 2610,  impressions:  76200, ctr: 3.43, position:  9.8, change:  140 },
  { keyword: 'live betting odds',            clicks: 2280,  impressions:  68400, ctr: 3.33, position: 12.1, change:   95 },
  { keyword: 'casino games online',          clicks: 1940,  impressions:  64800, ctr: 2.99, position: 14.3, change:  -45 },
  { keyword: 'best betting site',            clicks: 1780,  impressions:  58200, ctr: 3.06, position: 13.7, change:   62 },
  { keyword: 'cricket betting',              clicks: 1620,  impressions:  51600, ctr: 3.14, position: 10.5, change:  128 },
  { keyword: 'football accumulator',         clicks: 1440,  impressions:  47800, ctr: 3.01, position: 15.2, change:  -28 },
  { keyword: 'bet on cricket ipl',           clicks: 1280,  impressions:  44200, ctr: 2.90, position: 16.4, change:  340 },
  { keyword: 'banda bets app download',      clicks: 1180,  impressions:  18600, ctr: 6.34, position:  3.2, change:  156 },
  { keyword: 'football betting nigeria',     clicks: 1060,  impressions:  38400, ctr: 2.76, position: 14.8, change:   84 },
  { keyword: 'premier league betting',       clicks:  980,  impressions:  42600, ctr: 2.30, position: 17.6, change:  210 },
  { keyword: 'bet on basketball',            clicks:  860,  impressions:  34800, ctr: 2.47, position: 16.2, change:   45 },
  { keyword: 'sports betting kenya',         clicks:  820,  impressions:  28600, ctr: 2.87, position: 13.4, change:   92 },
  { keyword: 'online casino africa',         clicks:  760,  impressions:  32400, ctr: 2.35, position: 18.2, change:  -18 },
  { keyword: 'live score betting',           clicks:  720,  impressions:  26800, ctr: 2.69, position: 14.8, change:   38 },
  { keyword: 'betting tips today',           clicks:  680,  impressions:  38200, ctr: 1.78, position: 21.4, change:   62 },
  { keyword: 'banda bets bonus',             clicks:  640,  impressions:  14200, ctr: 4.51, position:  5.6, change:   94 },
]

export const gscTopPages: GSCPage[] = [
  { url: '/home',                    clicks: 9840,  impressions: 142000, ctr: 6.93, position: 2.4  },
  { url: '/sports/football',         clicks: 6420,  impressions: 118000, ctr: 5.44, position: 6.8  },
  { url: '/live-betting',            clicks: 5280,  impressions: 98600,  ctr: 5.36, position: 7.2  },
  { url: '/casino',                  clicks: 4160,  impressions: 124000, ctr: 3.35, position: 12.4 },
  { url: '/promotions',              clicks: 3840,  impressions: 86400,  ctr: 4.44, position: 8.6  },
  { url: '/sports/cricket',          clicks: 3200,  impressions: 76800,  ctr: 4.17, position: 9.4  },
  { url: '/register',                clicks: 2980,  impressions: 52400,  ctr: 5.69, position: 4.2  },
  { url: '/sports/basketball',       clicks: 2560,  impressions: 68200,  ctr: 3.75, position: 11.8 },
  { url: '/blog/betting-tips',       clicks: 2340,  impressions: 94600,  ctr: 2.47, position: 18.4 },
  { url: '/app-download',            clicks: 1980,  impressions: 44200,  ctr: 4.48, position: 7.8  },
]

export const gscDeviceData: GSCDevice[] = [
  { device: 'Mobile',  clicks: 28640, impressions: 742000, ctr: 3.86 },
  { device: 'Desktop', clicks: 15820, impressions: 412000, ctr: 3.84 },
  { device: 'Tablet',  clicks: 3860,  impressions: 91800,  ctr: 4.20 },
]

export const gscCountryData = [
  { country: 'South Africa', clicks: 28400, impressions: 684000, ctr: 4.15 },
  { country: 'Nigeria',      clicks: 8640,  impressions: 228000, ctr: 3.79 },
  { country: 'Kenya',        clicks: 4820,  impressions: 128000, ctr: 3.77 },
  { country: 'Zimbabwe',     clicks: 2960,  impressions: 82400,  ctr: 3.59 },
  { country: 'Ghana',        clicks: 2180,  impressions: 68200,  ctr: 3.20 },
  { country: 'Uganda',       clicks: 1840,  impressions: 48600,  ctr: 3.79 },
  { country: 'Congo (DRC)',  clicks: 1480,  impressions: 42200,  ctr: 3.51 },
  { country: 'Other',        clicks: 1320,  impressions: 55200,  ctr: 2.39 },
]

export const gscSearchAppearance = [
  { type: 'Web results',    clicks: 36480, impressions: 924000, ctr: 3.95, color: '#fa9602' },
  { type: 'Image search',   clicks:  6840, impressions: 198000, ctr: 3.45, color: '#3b82f6' },
  { type: 'Video results',  clicks:  3240, impressions:  86400, ctr: 3.75, color: '#10b981' },
  { type: 'News results',   clicks:  1760, impressions:  37400, ctr: 4.71, color: '#8b5cf6' },
]

export const gscCoreWebVitals = {
  mobile: {
    good:        68,
    needsWork:   22,
    poor:        10,
    lcp:        '2.4s',
    fid:         '84ms',
    cls:         '0.08',
  },
  desktop: {
    good:        84,
    needsWork:   12,
    poor:         4,
    lcp:        '1.2s',
    fid:         '42ms',
    cls:         '0.04',
  },
}

export const gscIndexCoverage = {
  valid:           1284,
  validWithWarning:  48,
  excluded:         186,
  error:             24,
  notIndexedReasons: [
    { reason: 'Crawled – not indexed',   count: 82 },
    { reason: 'Discovered – not crawled',count: 56 },
    { reason: 'Alternate page',          count: 28 },
    { reason: 'Blocked by robots.txt',   count: 14 },
    { reason: 'Soft 404',                count:  6 },
  ],
}

export const gscCTRDistribution = [
  { range: '0–1%',   pages: 284, color: '#ef4444' },
  { range: '1–3%',   pages: 412, color: '#f97316' },
  { range: '3–5%',   pages: 326, color: '#eab308' },
  { range: '5–10%',  pages: 184, color: '#22c55e' },
  { range: '10%+',   pages:  78, color: '#10b981' },
]
