
import React, { useState } from 'react';
import './Matches.css';

// Simple error boundary for WSOD protection
function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return (
      <div style={{color:'red',padding:'2rem',textAlign:'center',fontWeight:700}}>
        Something went wrong in Matches.<br/>
        <span style={{fontSize:'1rem',fontWeight:400}}>{error.message}</span>
      </div>
    );
  }
  return (
    <ErrorCatcher onError={setError}>{children}</ErrorCatcher>
  );
}

class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
import { clubLogos } from '../data/clubLogos';

// Accept matches as a prop for live data, fallback to static if not provided
const staticMatches = [
  { league: "Netherlands Eredivisie Promotion/Relegation", home: "Den Bosch", away: "Almere City", odds: ["2.7", "3.8", "2.33"] },
  { league: "Portugal Primeira Liga", home: "Sporting CP", away: "Tondela", odds: ["1.14", "8.5", "17"] },
  { league: "England Premier League", home: "Brentford", away: "West Ham", odds: ["2.05", "4.1", "3.6"] },
  { league: "England Premier League", home: "Arsenal", away: "Fulham", odds: ["1.48", "4.8", "8"] },
  { league: "England Premier League", home: "Wolverhampton Wanderers", away: "Sunderland", odds: ["3.15", "3.6", "2.4"] },
  { league: "Norway Premier League", home: "Tromsø", away: "Brann", odds: ["1.95", "3.75", "3.75"] },
  { league: "UEFA Champions League", home: "Atlético de Madrid", away: "Arsenal", odds: ["3.3", "3.4", "2.4"] },
  { league: "England Premier League", home: "Liverpool", away: "Chelsea", odds: ["2", "4.3", "3.6"] },
  { league: "England Premier League", home: "Chelsea", away: "Nottingham Forest", odds: ["1.75", "4.2", "5"] },
];


export default function Matches({ matches }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);


  // Use live matches if provided, else fallback to static
  let matchList = staticMatches;
  if (Array.isArray(matches) && matches.length > 0) {
    matchList = matches;
  }

  // Normalize API data if needed, with robust fallback
  const normalized = matchList.map((m, idx) => {
    try {
      const home = m?.home || m?.home_team || m?.homeTeam || '';
      const away = m?.away || m?.away_team || m?.awayTeam || '';
      const league = m?.league || m?.league_name || m?.tournament_name || m?.tournament || '';
      let odds = m?.odds || m?.odds_array || [];
      if (!Array.isArray(odds) && odds && typeof odds === 'object') {
        odds = [odds.home, odds.draw, odds.away].filter(Boolean);
      }
      return { ...m, home, away, league, odds: Array.isArray(odds) ? odds : [] };
    } catch (e) {
      return { home: '', away: '', league: '', odds: [], error: true, idx };
    }
  });

  const filtered = normalized.filter(
    m =>
      typeof m.home === 'string' && m.home.toLowerCase().includes(search.toLowerCase()) ||
      typeof m.away === 'string' && m.away.toLowerCase().includes(search.toLowerCase()) ||
      typeof m.league === 'string' && m.league.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="matches-section">
        <h2 style={{textAlign:'center', fontWeight:700, fontSize:'2rem', marginBottom:'1.5rem'}}>Select Match</h2>
        <input
          className="match-search"
          placeholder="Search Team or league…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{margin:'0 auto', display:'block', maxWidth:400}}
        />
        <div className="matches-list" style={{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
          {filtered.length === 0 && (
            <div style={{color:'#bbb', fontSize:'1.1rem', margin:'2rem 0'}}>No matches found</div>
          )}
          {filtered.map((m, i) => {
            if (m.error) {
              return <div key={i} style={{color:'red'}}>Invalid match data</div>;
            }
            const homeLogo = m.home ? clubLogos[m.home] || '' : '';
            const awayLogo = m.away ? clubLogos[m.away] || '' : '';
            return (
              <div
                className={`match-card${selected===i ? ' selected' : ''}`}
                key={i}
                style={{
                  cursor:'pointer',
                  border:selected===i?'2px solid #aa3bff':'1px solid #f0f0f0',
                  boxShadow:selected===i?'0 4px 16px rgba(170,59,255,0.08)':'0 2px 8px rgba(0,0,0,0.04)',
                  transition:'all 0.2s',
                  marginBottom:'1.2rem',
                  minWidth:320,
                  maxWidth:480,
                  width:'100%',
                  background:'#fff',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  padding:'1.2rem 1.5rem',
                }}
                onClick={() => setSelected(i)}
              >
                <div className="league" style={{textAlign:'center', marginBottom:8}}>{m.league || <span style={{color:'#bbb'}}>No league</span>}</div>
                <div className="teams" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:18, width:'100%'}}>
                  <span className="team" style={{display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-end'}}>
                    {homeLogo && <img src={homeLogo} alt={m.home} style={{height:32, width:32, objectFit:'contain', background:'#f8f8f8', borderRadius:8}} />}
                    <span style={{marginLeft:homeLogo?8:0, fontWeight:600}}>{m.home || <span style={{color:'#bbb'}}>No home</span>}</span>
                  </span>
                  <span className="vs" style={{margin:'0 12px', color:'#aa3bff', fontWeight:700}}>VS</span>
                  <span className="team" style={{display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-start'}}>
                    <span style={{marginRight:awayLogo?8:0, fontWeight:600}}>{m.away || <span style={{color:'#bbb'}}>No away</span>}</span>
                    {awayLogo && <img src={awayLogo} alt={m.away} style={{height:32, width:32, objectFit:'contain', background:'#f8f8f8', borderRadius:8}} />}
                  </span>
                </div>
                <div className="odds" style={{marginTop:10}}>
                  {Array.isArray(m.odds) && m.odds.length > 0 ? m.odds.map((odd, j) => (
                    <span className="odd" key={j}>{odd}</span>
                  )) : <span style={{color:'#bbb'}}>No odds</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
