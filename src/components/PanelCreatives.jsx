import React from 'react';
export default function PanelCreatives() {
  return (
    <div className="panel" id="panel-creatives">
      <div className="panel-header">
        <div>
          <div className="panel-title">My Creatives</div>
          <div className="panel-subtitle">0 creatives</div>
        </div>
        <div className="panel-actions">
          <input type="text" placeholder="Search creatives…" className="creatives-search" />
          <button className="btn amber">+ New</button>
        </div>
      </div>
      <div className="panel-body">Creatives gallery coming soon…</div>
    </div>
  );
}