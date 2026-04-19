/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY:            string
  readonly VITE_FIREBASE_AUTH_DOMAIN:        string
  readonly VITE_FIREBASE_PROJECT_ID:         string
  readonly VITE_FIREBASE_STORAGE_BUCKET:     string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID:string
  readonly VITE_FIREBASE_APP_ID:             string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Leaflet is loaded from CDN in index.html
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L: any
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any
  }
}
export {}
