export interface PageInsight {
  url:         string
  title:       string
  clicks:      number
  impressions: number
  ctr:         number
  position:    number
  sessions:    number
  bounceRate:  number
  avgDuration: string
  coreWebVital: 'good' | 'needs-work' | 'poor'
  lcp:         string
  cls:         string
  fid:         string
  issues:      string[]
  opportunity: string
}

export const pageInsights: PageInsight[] = [
  {
    url: '/home', title: 'Home – BandaBets',
    clicks: 9840, impressions: 142000, ctr: 6.93, position: 2.4,
    sessions: 18240, bounceRate: 28.4, avgDuration: '5:12',
    coreWebVital: 'good', lcp: '1.8s', cls: '0.04', fid: '62ms',
    issues: [],
    opportunity: 'Strong performer. A/B test CTA copy to further improve conversion.',
  },
  {
    url: '/sports/football', title: 'Football Betting – BandaBets',
    clicks: 6420, impressions: 118000, ctr: 5.44, position: 6.8,
    sessions: 12840, bounceRate: 32.1, avgDuration: '4:48',
    coreWebVital: 'good', lcp: '2.1s', cls: '0.06', fid: '74ms',
    issues: ['Missing structured data (Sports event schema)'],
    opportunity: 'Add FAQ schema and match schedule structured data to win rich snippets.',
  },
  {
    url: '/live-betting', title: 'Live Betting – BandaBets',
    clicks: 5280, impressions: 98600, ctr: 5.36, position: 7.2,
    sessions: 11420, bounceRate: 29.6, avgDuration: '6:04',
    coreWebVital: 'needs-work', lcp: '3.1s', cls: '0.09', fid: '112ms',
    issues: ['LCP above 2.5s threshold', 'Layout shift on odds updates'],
    opportunity: 'Fix real-time odds update layout shift. Improve LCP by lazy-loading off-screen odds.',
  },
  {
    url: '/casino', title: 'Casino Games – BandaBets',
    clicks: 4160, impressions: 124000, ctr: 3.35, position: 12.4,
    sessions: 8960, bounceRate: 41.2, avgDuration: '3:28',
    coreWebVital: 'needs-work', lcp: '2.8s', cls: '0.12', fid: '96ms',
    issues: ['High bounce rate', 'CTR below average for position', 'CLS above 0.1'],
    opportunity: 'CTR is low for pos 12 — rewrite meta title to include "online casino Africa". Reduce CLS from game thumbnails loading.',
  },
  {
    url: '/promotions', title: 'Promotions – BandaBets',
    clicks: 3840, impressions: 86400, ctr: 4.44, position: 8.6,
    sessions: 9240, bounceRate: 35.8, avgDuration: '3:52',
    coreWebVital: 'good', lcp: '2.2s', cls: '0.05', fid: '68ms',
    issues: ['Dead clicks on banner images (12.4%)'],
    opportunity: 'Make promotional banners fully clickable. Add urgency copy (timer) to bonus offers.',
  },
  {
    url: '/sports/cricket', title: 'Cricket Betting – BandaBets',
    clicks: 3200, impressions: 76800, ctr: 4.17, position: 9.4,
    sessions: 6840, bounceRate: 34.2, avgDuration: '4:18',
    coreWebVital: 'good', lcp: '2.0s', cls: '0.03', fid: '58ms',
    issues: ['Missing IPL-specific landing page'],
    opportunity: 'IPL search interest up 340%. Create dedicated /sports/cricket/ipl page to capture tournament traffic.',
  },
  {
    url: '/register', title: 'Register – BandaBets',
    clicks: 2980, impressions: 52400, ctr: 5.69, position: 4.2,
    sessions: 6420, bounceRate: 22.8, avgDuration: '4:56',
    coreWebVital: 'good', lcp: '1.6s', cls: '0.02', fid: '48ms',
    issues: [],
    opportunity: 'Best converting page. Use as template for other page optimisations.',
  },
  {
    url: '/blog/betting-tips', title: 'Betting Tips Blog – BandaBets',
    clicks: 2340, impressions: 94600, ctr: 2.47, position: 18.4,
    sessions: 5180, bounceRate: 48.6, avgDuration: '2:34',
    coreWebVital: 'poor', lcp: '4.2s', cls: '0.18', fid: '186ms',
    issues: ['LCP critical — 4.2s', 'High CLS from ad loading', 'High bounce rate', 'Position 18 — page 2'],
    opportunity: 'Critical: fix Core Web Vitals. Add internal links to betting pages. Target position 10 with updated content.',
  },
  {
    url: '/app-download', title: 'Download the App – BandaBets',
    clicks: 1980, impressions: 44200, ctr: 4.48, position: 7.8,
    sessions: 4640, bounceRate: 30.4, avgDuration: '3:06',
    coreWebVital: 'good', lcp: '1.9s', cls: '0.04', fid: '62ms',
    issues: ['No deep link schema for app stores'],
    opportunity: 'Add App Install structured data. Consider device-targeted landing pages (Android vs iOS).',
  },
  {
    url: '/sports/basketball', title: 'Basketball Betting – BandaBets',
    clicks: 2560, impressions: 68200, ctr: 3.75, position: 11.8,
    sessions: 5620, bounceRate: 37.6, avgDuration: '3:44',
    coreWebVital: 'needs-work', lcp: '2.9s', cls: '0.08', fid: '88ms',
    issues: ['No NBA-specific content', 'LCP slightly above threshold'],
    opportunity: 'NBA playoffs drive massive searches. Add dedicated NBA betting section with live scores.',
  },
]

export const pageInsightsSummary = {
  totalPages:     pageInsights.length,
  goodCWV:        pageInsights.filter(p => p.coreWebVital === 'good').length,
  needsWorkCWV:   pageInsights.filter(p => p.coreWebVital === 'needs-work').length,
  poorCWV:        pageInsights.filter(p => p.coreWebVital === 'poor').length,
  avgCtr:         +(pageInsights.reduce((s, p) => s + p.ctr, 0) / pageInsights.length).toFixed(2),
  avgPosition:    +(pageInsights.reduce((s, p) => s + p.position, 0) / pageInsights.length).toFixed(1),
  avgBounceRate:  +(pageInsights.reduce((s, p) => s + p.bounceRate, 0) / pageInsights.length).toFixed(1),
  pagesWithIssues: pageInsights.filter(p => p.issues.length > 0).length,
}
