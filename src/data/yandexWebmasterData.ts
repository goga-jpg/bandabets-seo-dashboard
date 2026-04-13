export const ywSummary = {
  pagesIndexed:      1_142,
  newPagesIndexed:      84,
  excludedPages:       196,
  crawlErrors:          18,
  sitemapPages:      1_280,
  internalLinks:    14_640,
  externalLinks:     2_840,
  indexedChange:       +6.8,
  errorChange:        -22.4,
}

export const ywDailyCrawl = [
  { date: 'Mar 14', crawled: 84,  indexed: 76,  errors: 2 },
  { date: 'Mar 15', crawled: 92,  indexed: 84,  errors: 1 },
  { date: 'Mar 16', crawled: 88,  indexed: 80,  errors: 2 },
  { date: 'Mar 17', crawled: 62,  indexed: 56,  errors: 1 },
  { date: 'Mar 18', crawled: 58,  indexed: 52,  errors: 1 },
  { date: 'Mar 19', crawled: 96,  indexed: 88,  errors: 2 },
  { date: 'Mar 20', crawled: 100, indexed: 92,  errors: 1 },
  { date: 'Mar 21', crawled: 98,  indexed: 90,  errors: 1 },
  { date: 'Mar 22', crawled: 94,  indexed: 86,  errors: 2 },
  { date: 'Mar 23', crawled: 90,  indexed: 82,  errors: 1 },
  { date: 'Mar 24', crawled: 66,  indexed: 60,  errors: 1 },
  { date: 'Mar 25', crawled: 60,  indexed: 54,  errors: 0 },
  { date: 'Mar 26', crawled: 104, indexed: 96,  errors: 1 },
  { date: 'Mar 27', crawled: 108, indexed: 100, errors: 1 },
  { date: 'Mar 28', crawled: 106, indexed: 98,  errors: 1 },
  { date: 'Mar 29', crawled: 110, indexed: 102, errors: 0 },
  { date: 'Mar 30', crawled: 104, indexed: 96,  errors: 1 },
  { date: 'Mar 31', crawled: 72,  indexed: 66,  errors: 1 },
  { date: 'Apr 01', crawled: 66,  indexed: 60,  errors: 0 },
  { date: 'Apr 02', crawled: 114, indexed: 106, errors: 1 },
  { date: 'Apr 03', crawled: 118, indexed: 110, errors: 0 },
  { date: 'Apr 04', crawled: 116, indexed: 108, errors: 1 },
  { date: 'Apr 05', crawled: 120, indexed: 112, errors: 0 },
  { date: 'Apr 06', crawled: 114, indexed: 106, errors: 1 },
  { date: 'Apr 07', crawled: 78,  indexed: 72,  errors: 0 },
  { date: 'Apr 08', crawled: 72,  indexed: 66,  errors: 1 },
  { date: 'Apr 09', crawled: 124, indexed: 116, errors: 0 },
  { date: 'Apr 10', crawled: 128, indexed: 120, errors: 0 },
  { date: 'Apr 11', crawled: 126, indexed: 118, errors: 0 },
  { date: 'Apr 12', crawled: 130, indexed: 122, errors: 0 },
]

export const ywTopQueries = [
  { query: 'banda bets',              clicks: 2840, impressions: 38400, ctr: 7.40, position: 1.8 },
  { query: 'banda bets вход',         clicks: 1480, impressions: 22600, ctr: 6.55, position: 2.2 },
  { query: 'онлайн ставки африка',    clicks:  820, impressions: 28400, ctr: 2.89, position: 9.6 },
  { query: 'banda bets скачать',      clicks:  680, impressions: 12400, ctr: 5.48, position: 3.4 },
  { query: 'футбол ставки',           clicks:  560, impressions: 24800, ctr: 2.26, position: 12.4 },
  { query: 'live betting odds',       clicks:  480, impressions: 18600, ctr: 2.58, position: 11.8 },
  { query: 'casino games',            clicks:  420, impressions: 16800, ctr: 2.50, position: 13.2 },
  { query: 'banda bets регистрация',  clicks:  380, impressions:  8400, ctr: 4.52, position: 4.6 },
]

export const ywSitemaps = [
  { sitemap: '/sitemap.xml',         submitted: 'Jan 15, 2025', pages: 480, indexed: 462, status: 'ok'      },
  { sitemap: '/sitemap-sports.xml',  submitted: 'Feb 02, 2025', pages: 380, indexed: 368, status: 'ok'      },
  { sitemap: '/sitemap-blog.xml',    submitted: 'Feb 18, 2025', pages: 280, indexed: 248, status: 'warning' },
  { sitemap: '/sitemap-casino.xml',  submitted: 'Mar 10, 2025', pages: 140, indexed: 124, status: 'ok'      },
]

export const ywIndexBreakdown = [
  { status: 'Indexed',           count: 1142, color: '#10b981' },
  { status: 'Indexed w/ issues', count:   48, color: '#f59e0b' },
  { status: 'Excluded',          count:  196, color: '#6b7280' },
  { status: 'Crawl errors',      count:   18, color: '#ef4444' },
]

export const ywPageErrors = [
  { type: '404 Not Found',        count: 8,  severity: 'error'   },
  { type: '5xx Server Error',     count: 4,  severity: 'error'   },
  { type: 'Redirect loop',        count: 3,  severity: 'warning' },
  { type: 'Slow page (>5s)',      count: 12, severity: 'warning' },
  { type: 'Blocked by robots',    count: 6,  severity: 'info'    },
  { type: 'Thin content',         count: 22, severity: 'warning' },
]
