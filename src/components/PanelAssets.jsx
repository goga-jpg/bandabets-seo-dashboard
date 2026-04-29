export default function PanelAssets() {
  return (
    <div className="panel" id="panel-assets">
      <div className="panel-header">
        <div>
          <div className="panel-title">Image Assets</div>
          <div className="panel-subtitle">Manage background images for your ad creatives</div>
        </div>
        <div className="panel-actions">
          <label className="btn amber" style={{cursor:'pointer'}}>
            Upload Images
            <input type="file" accept="image/*" multiple style={{display:'none'}} />
          </label>
        </div>
      </div>
      <div className="panel-body">Assets management coming soon…</div>
    </div>
  );
}