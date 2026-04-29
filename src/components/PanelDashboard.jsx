import { useEffect, useState } from 'react';
import Matches from './Matches';

const API_URL = "https://fx.banda.software/ke/highlights/slug/soccer?page=1&per_page=50&highlight_market_id=2&tournament_id=0&category_id=0&daily=0&hours=0&match_live_status=0&today=0&tomorrow=0&upcoming=0&boosted=0&order_type=priority";

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export default function PanelDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatives, setCreatives] = useState(() => getLocal('bb_creatives', []));
  const [assets, setAssets] = useState(() => getLocal('bb_assets', []));

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then(r => r.json())
      .then(json => {
        setMatches(Array.isArray(json?.data) ? json.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Stats
  const statTotal = creatives.length;
  const statAssets = assets.length;
  const statScheduled = creatives.filter(c => c.status === 'scheduled').length;
  const statMatches = matches.length;
  const recentCreatives = creatives.slice(0, 6);

  return (
    <div className="panel active" id="panel-dashboard">
      <div className="panel-header">
        <div>
          <div className="panel-title">Dashboard</div>
          <div className="panel-subtitle">Overview of your live creatives and match data</div>
        </div>
        <div className="panel-actions">
          <button className="btn" onClick={() => window.location.reload()}>Refresh Data</button>
          <button className="btn amber">New Creative</button>
        </div>
      </div>
      <div className="panel-body">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-label">Total Creatives</div>
            <div className="stat-card-value">{statTotal}</div>
            <div className="stat-card-sub">All formats combined</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Live Matches</div>
            <div className="stat-card-value">{statMatches}</div>
            <div className="stat-card-sub">From API · Football</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Active Assets</div>
            <div className="stat-card-value">{statAssets}</div>
            <div className="stat-card-sub">Uploaded images</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Scheduled</div>
            <div className="stat-card-value">{statScheduled}</div>
            <div className="stat-card-sub">Pending publish</div>
          </div>
        </div>
        <div className="section-label">Featured Matches</div>
        <Matches matches={matches} />
        <div className="divider"></div>
        <div className="section-label">Recent Creatives</div>
        <div id="dashboardCreativesContainer" className="creatives-grid">
          {recentCreatives.length === 0 ? (
            <div style={{gridColumn:'1/-1'}} className="empty-state">
              <svg className="empty-state-icon" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <div className="empty-state-text">No creatives yet</div>
              <div className="empty-state-sub">Build your first creative using the Creative Builder</div>
            </div>
          ) : (
            recentCreatives.map((c, i) => (
              <div className="creative-card" key={c.id || i}>
                <div className="creative-card-thumb">
                  <div style={{fontSize:'0.65rem',color:'var(--text-dim)',textAlign:'center',padding:'8px'}}>
                    <div style={{fontWeight:700,color:'var(--text-soft)',marginBottom:4}}>{c.format}</div>
                    <div style={{color:'var(--amber)',fontWeight:600}}>{c.match?.home_team || '–'} vs {c.match?.away_team || '–'}</div>
                    <div style={{marginTop:4}}>1: {c.odds?.home ?? '–'} · X: {c.odds?.draw ?? '–'} · 2: {c.odds?.away ?? '–'}</div>
                    <div style={{marginTop:6,opacity:0.5}}>Preview coming soon</div>
                  </div>
                </div>
                <div className="creative-card-body">
                  <div className="creative-card-title">{c.name}</div>
                  <div className="creative-card-meta">
                    <span><span className={`status-dot ${c.status}`}></span>{c.status}</span>
                    <span>{c.format}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}