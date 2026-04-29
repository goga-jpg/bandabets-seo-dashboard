import React, { useRef, useState, useEffect } from 'react';
import './BulkGenerate.css';

const POPPINS_FONT_URL = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';

const IAB_FORMATS = [
  'MPU (300x250)',
  'Half Page (300x600)',
  'Leaderboard (728x90)',
  'Wide Skyscraper (160x600)',
  'Mobile Banner (320x50)',
  'Billboard (970x250)',
  'Large Rectangle (336x280)',
  'Full Banner (468x60)',
  'Large Mobile Banner (320x100)',
  'Portrait (300x1050)',
  'Panorama (980x120)',
  'Netboard (580x400)',
  'Square (250x250)',
  'Vertical Rectangle (240x400)',
  'Small Square (200x200)',
  'Large Leaderboard (970x90)',
  'Super Leaderboard (970x210)',
  'Filmstrip (300x1050)',
  'Skyscraper (120x600)',
  'Rectangle (180x150)',
  'Triple Widescreen (930x180)'
];

export default function BulkGenerate() {
  console.log('BulkGenerate component mounted');
  const [images, setImages] = useState([]);
  const [formats, setFormats] = useState(IAB_FORMATS);
  const [darkMode, setDarkMode] = useState(true);
  const fileInput = useRef();

  useEffect(() => {
    // Dynamically load Poppins font for downloads
    if (!document.getElementById('poppins-font')) {
      const link = document.createElement('link');
      link.id = 'poppins-font';
      link.rel = 'stylesheet';
      link.href = POPPINS_FONT_URL;
      document.head.appendChild(link);
    }
  }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  // Download HTML with Poppins font
  const downloadHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Bulk Export</title><link href='${POPPINS_FONT_URL}' rel='stylesheet'><style>body{font-family:'Poppins',sans-serif;background:${darkMode ? '#181c24' : '#fff'};color:${darkMode ? '#fff':'#222'};padding:2rem;}</style></head><body>` +
      images.map(img => `<div style='margin-bottom:1rem;'><img src='${URL.createObjectURL(img)}' style='max-width:200px;display:block;'/><div>${img.name}</div></div>`).join('') +
      `<div style='margin-top:2rem;'><b>IAB Formats:</b><ul>${formats.map(f=>`<li>${f}</li>`).join('')}</ul></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bulk-export.html';
    a.click();
  };

  // Download images in selected format
  const downloadImages = (format) => {
    images.forEach(img => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(img);
      let ext = img.name.split('.').pop();
      if (['png','jpg','jpeg','gif','webp'].includes(format)) {
        ext = format === 'jpg' ? 'jpeg' : format;
      }
      a.download = img.name.replace(/\.[^.]+$/, '') + '.' + ext;
      a.click();
    });
  };

  return (
    <div className={darkMode ? 'bulkgen-section bulkgen-dark' : 'bulkgen-section bulkgen-light'}>
      <div style={{color:'red',fontWeight:'bold'}}>BulkGenerate component loaded</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Bulk Generate & Export All</h2>
        <button className="bulkgen-toggle-btn" onClick={()=>setDarkMode(d=>!d)}>
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <div className="bulkgen-upload">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button className="bulkgen-upload-btn" onClick={() => fileInput.current.click()}>
          Upload Images
        </button>
        <div className="bulkgen-uploaded">
          {images.length === 0 ? <span>No images uploaded yet.</span> :
            images.map((img, i) => (
              <div className="bulkgen-thumb" key={i}>
                <img src={URL.createObjectURL(img)} alt="uploaded" />
                <span>{img.name}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="bulkgen-formats">
        <h3>IAB Formats</h3>
        <div className="bulkgen-formats-list">
          {formats.map((fmt, i) => {
            const match = fmt.match(/^(.*?)(\s*\((\d+x\d+)\))?$/);
            return (
              <span className="bulkgen-format" key={i}>
                {match ? `${match[1].trim()}${match[3] ? ` (${match[3]})` : ''}` : fmt}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{display:'flex',gap:'1rem',marginTop:'1.5rem',alignItems:'center',flexWrap:'wrap'}}>
        <button className="bulkgen-export-btn" onClick={downloadHTML}>
          Download HTML
        </button>
        <button className="bulkgen-export-btn" onClick={()=>downloadImages('png')}>
          Download PNG
        </button>
        <button className="bulkgen-export-btn" onClick={()=>downloadImages('jpg')}>
          Download JPG
        </button>
        <button className="bulkgen-export-btn" onClick={()=>downloadImages('gif')}>
          Download GIF
        </button>
        <button className="bulkgen-export-btn" onClick={()=>downloadImages('webp')}>
          Download WEBP
        </button>
      </div>
    </div>
  );
}
