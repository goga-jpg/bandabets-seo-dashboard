import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2,
  RefreshCw, Send, User, Bot, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useFilters } from '../../context/FilterContext'
import { generateInsightsFromGemini, askGemini, GeminiInsight } from '../../services/gemini'

// ── Static fallback insights (shown on first load while Gemini loads) ──────────
const FALLBACK: GeminiInsight[] = [
  { type: 'win',         title: 'CTR above industry benchmark',              body: 'Your organic CTR of 3.88% exceeds the typical 2–3% range for sports betting in Africa. Strong title tags and compelling meta descriptions are driving higher click-through from search results.',  metric: '3.88% CTR',          source: 'Google Search Console' },
  { type: 'win',         title: 'APK downloads growing 38% period-over-period', body: 'Total app downloads hit 24,680 with Android leading at 74.6% share. Nigeria drives the most installs — consider geo-targeted push notification campaigns to convert installs to first deposits.', metric: '+38.4% downloads', source: 'APK Tracking' },
  { type: 'opportunity', title: 'Page-2 keywords ready for Page-1 push',    body: 'Several high-volume queries rank at positions 11–14. A focused internal linking and content update campaign on "sports betting south africa", "live betting odds", and "cricket betting" could move them onto Page 1.',              metric: 'Avg pos. 14.2',       source: 'Google Search Console' },
  { type: 'opportunity', title: 'Bing is under-optimised vs Google',         body: 'Bing delivers a 4.39% CTR — higher than Google — but at a fraction of the volume. Submit an updated XML sitemap, verify ownership in Bing Webmaster Tools, and claim Bing Places to capture low-competition traffic.',               metric: '4.39% Bing CTR',     source: 'Bing Webmaster' },
  { type: 'warning',     title: 'Dead clicks on /promotions banners (12.4%)', body: 'Microsoft Clarity shows users tapping non-interactive banner images on the promotions page. Making banners fully clickable or adding a visible CTA could recover this lost engagement.',                                                    metric: '12.4% dead clicks',  source: 'Microsoft Clarity' },
  { type: 'warning',     title: 'Rage clicks on casino filter tabs (4.2%)',   body: 'Users are frustrated with slow or unresponsive filter tabs on /casino. This is likely a performance issue on mobile. Investigate JS execution time and add optimistic UI updates to reduce perceived lag.',                                  metric: '4.2% rage clicks',   source: 'Microsoft Clarity' },
  { type: 'action',      title: 'IPL 2025 search interest up +340%',          body: 'Google Trends shows cricket searches surging. Create dedicated IPL match-betting landing pages, publish daily tips, and run cricket keyword campaigns now before CPC increases closer to the tournament.',                                    metric: '+340% cricket trend', source: 'Google Trends' },
  { type: 'action',      title: 'Email channel has highest conv. rate (11.65%)', body: 'Email drives the best conversion rate of all channels — more than double organic search. Increase email send frequency, add abandoned-registration flows, and test SMS for markets with low email open rates.', metric: '11.65% email conv.', source: 'GA4' },
]

const typeConfig = {
  win:         { icon: CheckCircle2,  bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981', label: 'Win'         },
  opportunity: { icon: TrendingUp,    bg: 'bg-blue-50',    border: 'border-blue-100',    badge: 'bg-blue-100 text-blue-700',       color: '#3b82f6', label: 'Opportunity' },
  warning:     { icon: AlertTriangle, bg: 'bg-yellow-50',  border: 'border-yellow-100',  badge: 'bg-yellow-100 text-yellow-700',   color: '#f59e0b', label: 'Warning'     },
  action:      { icon: Lightbulb,     bg: 'bg-purple-50',  border: 'border-purple-100',  badge: 'bg-purple-100 text-purple-700',   color: '#8b5cf6', label: 'Action'      },
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

const SUGGESTED_QUESTIONS = [
  'Which country should we focus on for the next campaign?',
  'Why is our bounce rate high on mobile?',
  'What keywords should we prioritise for SEO?',
  'How can we improve APK downloads in Kenya?',
  "What's causing the rage clicks on the casino page?",
]

export default function AIInsights() {
  const { country, displayLabel, dateRange } = useFilters()
  const [insights, setInsights]   = useState<GeminiInsight[]>(FALLBACK)
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError]     = useState('')
  const [filter, setFilter]       = useState<'all' | GeminiInsight['type']>('all')

  // Chat state
  const [messages, setMessages]   = useState<ChatMessage[]>([])
  const [input, setInput]         = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [showChat, setShowChat]   = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  const filtered = filter === 'all' ? insights : insights.filter((i) => i.type === filter)
  const counts   = {
    win:         insights.filter((i) => i.type === 'win').length,
    opportunity: insights.filter((i) => i.type === 'opportunity').length,
    warning:     insights.filter((i) => i.type === 'warning').length,
    action:      insights.filter((i) => i.type === 'action').length,
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerateInsights = async () => {
    setLoadingAI(true)
    setAiError('')
    try {
      const result = await generateInsightsFromGemini(country, displayLabel)
      setInsights(result)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setAiError(`Gemini error: ${msg}. Showing cached insights.`)
      setInsights(FALLBACK)
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSend = async (text?: string) => {
    const question = (text ?? input).trim()
    if (!question || chatLoading) return

    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: question }
    const loadingMsg: ChatMessage = { role: 'assistant', content: '', loading: true }
    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setChatLoading(true)

    try {
      const answer = await askGemini(question, country, displayLabel)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: answer },
      ])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: `Gemini error: ${msg}` },
      ])
    } finally {
      setChatLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="space-y-6">

      {/* Hero header */}
      <div className="card p-6 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#fa9602', filter: 'blur(40px)' }} />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-white">AI Insights</h2>
                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-medium">Gemini</span>
              </div>
              <p className="text-sm text-gray-400">
                Powered by Google Gemini · {country !== 'All' ? country : 'All Countries'} · {displayLabel}
              </p>
            </div>
            <button
              onClick={handleGenerateInsights}
              disabled={loadingAI}
              className="flex items-center gap-2 bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={14} className={loadingAI ? 'animate-spin' : ''} />
              {loadingAI ? 'Analysing…' : 'Generate Insights'}
            </button>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.entries(counts) as [GeminiInsight['type'], number][]).map(([type, count]) => (
              <div key={type} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full" style={{ background: typeConfig[type].color }} />
                <span className="text-xs text-white font-medium">{count} {typeConfig[type].label}{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>

          {aiError && (
            <p className="text-xs text-yellow-400 mt-3 flex items-center gap-1">
              <AlertTriangle size={12} /> {aiError}
            </p>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'win', 'opportunity', 'warning', 'action'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
              filter === f ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-gray-200 hover:border-accent hover:text-accent'
            }`}
          >
            {f === 'all' ? `All (${insights.length})` : `${typeConfig[f].label} (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Insights grid */}
      {loadingAI ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((insight, i) => {
            const cfg = typeConfig[insight.type]
            const Icon = cfg.icon
            return (
              <div key={i} className={`card p-5 border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm shrink-0">
                    <Icon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{insight.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{insight.body}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {insight.metric && (
                        <span className="text-xs font-semibold text-gray-800 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                          {insight.metric}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{insight.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Chat with Gemini */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-accent" />
            <span className="font-semibold text-gray-900">Ask Gemini about your data</span>
            <span className="text-xs text-gray-400">· Contextual Q&A</span>
          </div>
          {showChat ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>

        {showChat && (
          <div className="border-t border-gray-100">
            {/* Suggested questions */}
            {messages.length === 0 && (
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Suggested questions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={chatLoading}
                      className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.loading ? (
                        <div className="flex gap-1 items-center h-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={13} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your analytics data…"
                disabled={chatLoading}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || chatLoading}
                className="p-2.5 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
