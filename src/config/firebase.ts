import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyBcLKj8iHB_LBUZJ4Z7vAp0MjVAR8_pfaQ",
  authDomain:        "bandabets-dashboard.firebaseapp.com",
  projectId:         "bandabets-dashboard",
  storageBucket:     "bandabets-dashboard.firebasestorage.app",
  messagingSenderId: "850863038178",
  appId:             "1:850863038178:web:48ba0447a1f4ff310288bb",
}

export const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
