import React from 'react';
export default function PanelAnalytics() {
  return (
    <div className="panel" id="panel-analytics">
      <div className="panel-header">
        <div>
          <div className="panel-title">Analytics</div>
          <div className="panel-subtitle">Performance tracking for your ad creatives</div>
        </div>
        <div className="panel-actions">
          <select className="analytics-range">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
      </div>
      <div className="panel-body">Analytics coming soon…</div>
    </div>
  );
}