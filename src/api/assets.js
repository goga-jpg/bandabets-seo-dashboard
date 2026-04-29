// src/api/assets.js
// Handles upload, list, and download of assets and creatives

const API_BASE = process.env.REACT_APP_API_URL || 'https://your-backend-api.com';

export async function uploadAsset(file, folder = 'uploads') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch(`${API_BASE}/assets/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function listAssets(folder = 'uploads') {
  const res = await fetch(`${API_BASE}/assets/list?folder=${encodeURIComponent(folder)}`);
  if (!res.ok) throw new Error('List failed');
  return res.json();
}

export async function downloadAsset(filename, folder = 'uploads') {
  const res = await fetch(`${API_BASE}/assets/download?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function createFolder(folder) {
  const res = await fetch(`${API_BASE}/assets/folder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!res.ok) throw new Error('Create folder failed');
  return res.json();
}
