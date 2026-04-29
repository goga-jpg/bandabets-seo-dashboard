import './Matches.css';

const matches = [
  {
    league: "Netherlands Eredivisie Promotion/Relegation",
    home: "Den Bosch",
    away: "Almere City",
    odds: ["2.7", "3.8", "2.33"]
  },
  {
    league: "Portugal Primeira Liga",
    home: "Sporting CP",
    away: "Tondela",
    odds: ["1.14", "8.5", "17"]
  },
  {
    league: "England Premier League",
    home: "Brentford",
    away: "West Ham",
    odds: ["2.05", "4.1", "3.6"]
  },
  {
    league: "England Premier League",
    home: "Arsenal",
    away: "Fulham",
    odds: ["1.48", "4.8", "8"]
  },
  {
    league: "England Premier League",
    home: "Wolverhampton Wanderers",
    away: "Sunderland",
    odds: ["3.15", "3.6", "2.4"]
  },
  {
    league: "Norway Premier League",
    home: "Tromsø",
    away: "Brann",
    odds: ["1.95", "3.75", "3.75"]
  },
  {
    league: "UEFA Champions League",
    home: "Atlético de Madrid",
    away: "Arsenal",
    odds: ["3.3", "3.4", "2.4"]
  },
  {
    league: "England Premier League",
    home: "Liverpool",
    away: "Chelsea",
    odds: ["2", "4.3", "3.6"]
  },
  {
    league: "England Premier League",
    home: "Chelsea",
    away: "Nottingham Forest",
    odds: ["1.75", "4.2", "5"]
  },
  {
    league: "Saudi Arabia Pro League",
    home: "",
    away: "",
    odds: []
  }
];

export default function Matches() {
  return (
    <div className="matches-section">
      <h2>Select Match</h2>
      <input className="match-search" placeholder="Search Team or league…" />
      <div className="matches-list">
        {matches.map((m, i) => (
          <div className="match-card" key={i}>
            <div className="league">{m.league}</div>
            <div className="teams">
              <span className="team">{m.home}</span>
              <span className="vs">VS</span>
              <span className="team">{m.away}</span>
            </div>
            <div className="odds">
              {m.odds.map((odd, j) => (
                <span className="odd" key={j}>{odd}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
