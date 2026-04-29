
import './Matches.css';

import { useState } from 'react';
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
  const matchList = Array.isArray(matches) && matches.length > 0 ? matches : staticMatches;

  // Normalize API data if needed
  const normalized = matchList.map(m => {
    // Try to support both static and API formats
    const home = m.home || m.home_team || m.homeTeam || '';
    const away = m.away || m.away_team || m.awayTeam || '';
    const league = m.league || m.league_name || m.tournament_name || m.tournament || '';
    let odds = m.odds || m.odds_array || [];
    if (!Array.isArray(odds) && odds && typeof odds === 'object') {
      odds = [odds.home, odds.draw, odds.away].filter(Boolean);
    }
    return { ...m, home, away, league, odds };
  });

  const filtered = normalized.filter(
    m =>
      m.home.toLowerCase().includes(search.toLowerCase()) ||
      m.away.toLowerCase().includes(search.toLowerCase()) ||
      m.league.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
          const homeLogo = clubLogos[m.home] || '';
          const awayLogo = clubLogos[m.away] || '';
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
              <div className="league" style={{textAlign:'center', marginBottom:8}}>{m.league}</div>
              <div className="teams" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:18, width:'100%'}}>
                <span className="team" style={{display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-end'}}>
                  {homeLogo && <img src={homeLogo} alt={m.home} style={{height:32, width:32, objectFit:'contain', background:'#f8f8f8', borderRadius:8}} />}
                  <span style={{marginLeft:homeLogo?8:0, fontWeight:600}}>{m.home}</span>
                </span>
                <span className="vs" style={{margin:'0 12px', color:'#aa3bff', fontWeight:700}}>VS</span>
                <span className="team" style={{display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-start'}}>
                  <span style={{marginRight:awayLogo?8:0, fontWeight:600}}>{m.away}</span>
                  {awayLogo && <img src={awayLogo} alt={m.away} style={{height:32, width:32, objectFit:'contain', background:'#f8f8f8', borderRadius:8}} />}
                </span>
              </div>
              <div className="odds" style={{marginTop:10}}>
                {m.odds && m.odds.map && m.odds.map((odd, j) => (
                  <span className="odd" key={j}>{odd}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
