import React from 'react';
// Topbar component for Bandabets Platform
export default function Topbar({ onPanelSwitch, activePanel }) {
  return (
    <div className="topbar">
      {/* Brand */}
      <div className="topbar-brand">
        <img src="https://touchvasgaming.b-cdn.net/banda/bandabetslogo.png" alt="Bandabets" onError={e => (e.target.style.display = 'none')} />
        <div>
          <div className="topbar-brand-name">Ad Creative Studio</div>
          <div className="topbar-brand-sub">Bandabets · Kenya</div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="topbar-nav">
        <button className={`nav-tab${activePanel === 'dashboard' ? ' active' : ''}`} onClick={() => onPanelSwitch('dashboard')}>Dashboard</button>
        <button className={`nav-tab${activePanel === 'builder' ? ' active' : ''}`} onClick={() => onPanelSwitch('builder')}>Creative Builder</button>
        <button className={`nav-tab${activePanel === 'creatives' ? ' active' : ''}`} onClick={() => onPanelSwitch('creatives')}>My Creatives</button>
        <button className={`nav-tab${activePanel === 'assets' ? ' active' : ''}`} onClick={() => onPanelSwitch('assets')}>Assets</button>
        <button className={`nav-tab${activePanel === 'schedule' ? ' active' : ''}`} onClick={() => onPanelSwitch('schedule')}>Schedule</button>
        <button className={`nav-tab${activePanel === 'analytics' ? ' active' : ''}`} onClick={() => onPanelSwitch('analytics')}>Analytics</button>
      </div>
      {/* Right Side */}
      <div className="topbar-right">
        <div className="topbar-live">
          <span className="live-dot"></span>
          <span>Connecting…</span>
        </div>
        <button className="topbar-btn">Sync API</button>
        <button className="topbar-btn primary" onClick={() => onPanelSwitch('builder')}>+ New Creative</button>
      </div>
    </div>
  );
}
