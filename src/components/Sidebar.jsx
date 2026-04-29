// Sidebar component for Bandabets Platform
export default function Sidebar({ onPanelSwitch, activePanel }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section-title">Campaigns</div>
      <div className={`sidebar-item${activePanel === 'dashboard' ? ' active' : ''}`} onClick={() => onPanelSwitch('dashboard')}>All Creatives <span className="badge">0</span></div>
      <div className="sidebar-item"><span className="status-dot live"></span>Live <span className="badge">0</span></div>
      <div className="sidebar-item"><span className="status-dot draft"></span>Drafts <span className="badge">0</span></div>
      <div className="sidebar-section-title">IAB Formats</div>
      <div className={`sidebar-item${activePanel === 'builder' ? ' active' : ''}`} onClick={() => onPanelSwitch('builder')}>MPU 300×250 <span className="badge">0</span></div>
      <div className="sidebar-item">Half Page 300×600 <span className="badge">0</span></div>
      <div className="sidebar-item">Leaderboard 728×90 <span className="badge">0</span></div>
      <div className="sidebar-item">Mobile Banner 320×50 <span className="badge">0</span></div>
      <div className="sidebar-item">Wide Skyscraper 160×600 <span className="badge">0</span></div>
      <div className="sidebar-section-title">Quick Actions</div>
      <div className="sidebar-item">Bulk Generate</div>
      <div className="sidebar-item">Export All</div>
    </div>
  );
}
