import React, { useState, useRef } from 'react';
import { uploadAsset, listAssets, getAssetUrl } from '../api/supabaseAssets';

export default function PanelAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef();

  async function fetchAssets() {
    setLoading(true);
    setError('');
    try {
      const files = await listAssets('uploads');
      setAssets(files || []);
    } catch (e) {
      setError(e.message || 'Failed to list assets');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    setLoading(true);
    setError('');
    try {
      for (const file of files) {
        await uploadAsset(file, 'uploads');
      }
      await fetchAssets();
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setLoading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  // Fetch assets on mount
  React.useEffect(() => { fetchAssets(); }, []);

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
            <input
              type="file"
              accept="image/*"
              multiple
              style={{display:'none'}}
              ref={fileInput}
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>
      <div className="panel-body">
        {loading && <div>Loading…</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={{display:'flex',flexWrap:'wrap',gap:16,marginTop:16}}>
          {assets && assets.length > 0 ? assets.map(a => (
            <div key={a.name} style={{border:'1px solid #eee',borderRadius:8,padding:8}}>
              <img src={getAssetUrl(a.name)} alt={a.name} style={{width:120,height:120,objectFit:'cover',borderRadius:6}} />
              <div style={{fontSize:12,marginTop:4,textAlign:'center'}}>{a.name}</div>
            </div>
          )) : !loading && <div style={{color:'#bbb'}}>No assets uploaded yet.</div>}
        </div>
      </div>
    </div>
  );
}