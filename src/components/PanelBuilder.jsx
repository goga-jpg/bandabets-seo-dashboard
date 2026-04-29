import { useState, useEffect } from 'react';

const API_URL = "https://fx.banda.software/ke/highlights/slug/soccer?page=1&per_page=50&highlight_market_id=2&tournament_id=0&category_id=0&daily=0&hours=0&match_live_status=0&today=0&tomorrow=0&upcoming=0&boosted=0&order_type=priority";
const FORMATS = [
  { key: '300x250', label: '300×250 MPU' },
  { key: '300x600', label: '300×600 Half Page' },
  { key: '728x90', label: '728×90 Leaderboard' },
  { key: '320x50', label: '320×50 Mobile' },
  { key: '160x600', label: '160×600 Skyscraper' },
];

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export default function PanelBuilder() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [format, setFormat] = useState('300x250');
  const [creativeName, setCreativeName] = useState('');
  const [ctaText, setCtaText] = useState('Bet Now');
  const [logoUrl, setLogoUrl] = useState('https://touchvasgaming.b-cdn.net/banda/bandabetslogo.png');
  const [showLogo, setShowLogo] = useState(true);

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

  // Filtered matches
  const filteredMatches = matches.filter(m =>
    (m.home_team + ' ' + m.away_team + ' ' + m.tournament).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (selectedMatch) {
      setCreativeName(`${selectedMatch.home_team || 'Home'} vs ${selectedMatch.away_team || 'Away'} – ${format}`);
    }
  }, [selectedMatch, format]);

  return (
    <div className="panel" id="panel-builder">
      <div className="panel-header">
        <div>
          <div className="panel-title">Creative Builder</div>
          <div className="panel-subtitle">Configure and preview your ad creative across all IAB formats</div>
        </div>
        <div className="panel-actions">
          <button className="btn">Save Draft</button>
          <button className="btn amber">Generate &amp; Save</button>
        </div>
      </div>
      <div className="panel-body" style={{overflow:'hidden',padding:0}}>
        <div className="builder-layout" style={{padding:'20px 28px 0',height:'calc(100vh - 160px)',overflow:'hidden'}}>
          {/* Canvas */}
          <div className="builder-canvas">
            <div className="canvas-toolbar">
              <span style={{fontSize:'0.7rem',fontWeight:700,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'0.7px',marginRight:4}}>Format:</span>
              {FORMATS.map(f => (
                <div
                  key={f.key}
                  className={`size-chip${format === f.key ? ' active' : ''}`}
                  onClick={() => setFormat(f.key)}
                >
                  {f.label}
                </div>
              ))}
              <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                <button className="btn sm" disabled>Download</button>
              </div>
            </div>
            <div className="canvas-area" id="canvasArea">
              <div id="adPreviewContainer" style={{color:'var(--text-dim)',textAlign:'center',marginTop:40}}>
                <div style={{fontSize:'1.1rem'}}>Ad preview coming soon…</div>
                {selectedMatch && <div style={{marginTop:8}}>Selected: {selectedMatch.home_team} vs {selectedMatch.away_team}</div>}
              </div>
            </div>
          </div>
          {/* Builder Sidebar */}
          <div className="builder-sidebar" style={{overflowY:'auto',paddingBottom:20}}>
            {/* Match Selection */}
            <div className="bside-card">
              <div className="bside-title">Select Match</div>
              <div className="form-group">
                <label>Search</label>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Team or league…" />
              </div>
              <div style={{maxHeight:200,overflowY:'auto',display:'flex',flexDirection:'column',gap:5}}>
                {loading ? (
                  <div className="empty-state" style={{padding:20}}><div className="loading-spinner"></div></div>
                ) : filteredMatches.length === 0 ? (
                  <div className="empty-state" style={{padding:20}}><div className="empty-state-text">No matches found</div></div>
                ) : (
                  filteredMatches.slice(0,20).map(m => {
                    const sel = selectedMatch && (selectedMatch.match_id || selectedMatch.id) === (m.match_id || m.id);
                    return (
                      <div
                        className={`match-row${sel ? ' selected' : ''}`}
                        style={{padding:'8px 10px',cursor:'pointer'}}
                        key={m.match_id || m.id}
                        onClick={() => setSelectedMatch(m)}
                      >
                        <div className="match-league">{m.tournament || 'Football'}</div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
                          <span style={{fontSize:'0.8rem',fontWeight:700,color:'var(--text)'}}>{m.home_team || 'Home'}</span>
                          <span className="match-vs" style={{fontSize:'0.58rem'}}>VS</span>
                          <span style={{fontSize:'0.8rem',fontWeight:700,color:'var(--text)'}}>{m.away_team || 'Away'}</span>
                        </div>
                        <div style={{display:'flex',gap:4,marginTop:4}}>
                          <span className="odd-pill" style={{flex:1,padding:3}}><span className="odd-pill-val">{m.highlight_market?.outcomes?.find(o=>o.alias==='1')?.odds ?? '–'}</span></span>
                          <span className="odd-pill" style={{flex:1,padding:3}}><span className="odd-pill-val">{m.highlight_market?.outcomes?.find(o=>o.alias==='x')?.odds ?? '–'}</span></span>
                          <span className="odd-pill" style={{flex:1,padding:3}}><span className="odd-pill-val">{m.highlight_market?.outcomes?.find(o=>o.alias==='2')?.odds ?? '–'}</span></span>
                        </div>
                        <div className="match-check"><svg width="10" height="10" fill="none" stroke="#080c12" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Creative Options */}
            <div className="bside-card">
              <div className="bside-title">Options</div>
              <div className="form-group">
                <label>Creative Name</label>
                <input type="text" value={creativeName} onChange={e => setCreativeName(e.target.value)} placeholder="e.g. Man City vs Arsenal – MPU" />
              </div>
              <div className="form-group">
                <label>CTA Text</label>
                <input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Brand Logo URL (optional override)</label>
                <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
              </div>
              <div className="toggle-row">
                <span className="toggle-label">Show Logo</span>
                <button className={`toggle${showLogo ? ' on' : ''}`} onClick={() => setShowLogo(v => !v)} type="button"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}