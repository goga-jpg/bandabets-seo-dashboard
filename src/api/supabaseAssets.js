// src/api/supabaseAssets.js
import { supabase } from './supabaseClient';

// Upload a file to a bucket/folder
export async function uploadAsset(file, folder = 'uploads') {
  const filePath = `${folder}/${file.name}`;
  const { data, error } = await supabase.storage.from('assets').upload(filePath, file, { upsert: true });
  if (error) throw error;
  return data;
}

// List files in a folder
export async function listAssets(folder = 'uploads') {
  const { data, error } = await supabase.storage.from('assets').list(folder, { limit: 100 });
  if (error) throw error;
  return data;
}

// Download a file
export function getAssetUrl(filename, folder = 'uploads') {
  return supabase.storage.from('assets').getPublicUrl(`${folder}/${filename}`).data.publicUrl;
}

// Create a folder (Supabase creates folders automatically on upload)
export async function createFolder(folder) {
  // No-op: Supabase auto-creates folders
  return { folder };
}
