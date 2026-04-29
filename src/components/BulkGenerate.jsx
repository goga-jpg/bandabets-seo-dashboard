import { useRef, useState } from 'react';
import './BulkGenerate.css';

const IAB_FORMATS = [
  '300x250', '300x600', '320x50', '320x100', '336x280', '468x60', '728x90', '970x90', '970x250', '160x600', '300x1050', '180x150', '240x400', '250x250', '200x200', '980x120', '930x180', '250x360', '580x400', '120x600', '300x50', '300x100', '640x480', '320x480', '180x500', '980x240', '320x320', '320x160', '320x250', '300x600', '970x66', '970x210', '970x90', '970x250', '970x415', '970x500', '980x120', '980x240', '980x400', '300x600', '320x50', '320x100', '336x280', '468x60', '728x90', '970x90', '970x250', '160x600', '300x1050', '180x150', '240x400', '250x250', '200x200', '980x120', '930x180', '250x360', '580x400', '120x600', '300x50', '300x100', '640x480', '320x480', '180x500', '980x240', '320x320', '320x160', '320x250', '970x250'
];

export default function BulkGenerate() {
  const [images, setImages] = useState([]);
  const [formats, setFormats] = useState(IAB_FORMATS);
  const fileInput = useRef();

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    // In a real app, upload to server and save to /assets
  };

  const handleExportAll = () => {
    // Placeholder for export logic
    alert('Exporting all creatives!');
  };

  return (
    <div className="bulkgen-section">
      <h2>Bulk Generate & Export All</h2>
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
          {formats.map((fmt, i) => (
            <span className="bulkgen-format" key={i}>{fmt}</span>
          ))}
        </div>
      </div>
      <button className="bulkgen-export-btn" onClick={handleExportAll}>
        Export All
      </button>
    </div>
  );
}
