import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  signInWithRedirect, signOut as firebaseSignOut, getRedirectResult,
  onAuthStateChanged, updateProfile, User as FirebaseUser,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, query, where, getDocs, writeBatch,
} from 'firebase/firestore'
import { auth, db, googleProvider } from '../config/firebase'

export type UserRole = 'super_admin' | 'admin' | 'member'

export interface AppUser {
  uid:        string
  email:      string
  name:       string
  photoURL:   string
  role:       UserRole
  invitedBy?: string
}

interface AuthContextType {
  user:              AppUser | null
  loading:           boolean
  accessDenied:      boolean
  signInWithGoogle:  () => Promise<void>
  signOut:           () => Promise<void>
  updateUserProfile: (data: { name?: string; photoURL?: string }) => Promise<void>
}

export const SUPER_ADMIN_EMAIL = 'goga@5dm.africa'
const AuthContext = createContext<AuthContextType | null>(null)

async function resolveUserAccess(fbUser: FirebaseUser): Promise<AppUser | 'denied'> {
  const ref  = doc(db, 'users', fbUser.uid)
  const snap = await getDoc(ref)

  // Super admin always gets in
  if (fbUser.email === SUPER_ADMIN_EMAIL) {
    const existing = snap.exists() ? snap.data() : {}
    const data: AppUser = {
      uid:      fbUser.uid,
      email:    fbUser.email!,
      name:     existing.name     ?? fbUser.displayName ?? 'Goga',
      photoURL: existing.photoURL ?? fbUser.photoURL    ?? '',
      role:     'super_admin',
    }
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
    return data
  }

  // Existing authorised user
  if (snap.exists()) {
    const d = snap.data()
    return {
      uid:       fbUser.uid,
      email:     fbUser.email!,
      name:      d.name      ?? fbUser.displayName ?? '',
      photoURL:  d.photoURL  ?? fbUser.photoURL    ?? '',
      role:      d.role      as UserRole,
      invitedBy: d.invitedBy,
    }
  }

  // Check for a pending invitation matching this email
  const invQ    = query(
    collection(db, 'invitations'),
    where('email',  '==', fbUser.email),
    where('status', '==', 'pending'),
  )
  const invSnap = await getDocs(invQ)
  if (!invSnap.empty) {
    const inv      = invSnap.docs[0]
    const invData  = inv.data()
    const userData: AppUser = {
      uid:       fbUser.uid,
      email:     fbUser.email!,
      name:      fbUser.displayName ?? '',
      photoURL:  fbUser.photoURL    ?? '',
      role:      invData.role       as UserRole,
      invitedBy: invData.invitedBy,
    }
    const batch = writeBatch(db)
    batch.set(ref, { ...userData, createdAt: serverTimestamp() })
    batch.update(inv.ref, { status: 'accepted', acceptedAt: serverTimestamp() })
    await batch.commit()
    return userData
  }

  return 'denied'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,         setUser]         = useState<AppUser | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    // Handle redirect result first (fires after Google redirects back)
    getRedirectResult(auth).catch(() => {})

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null); setAccessDenied(false); setLoading(false)
        return
      }
      try {
        const result = await resolveUserAccess(fbUser)
        if (result === 'denied') { setUser(null); setAccessDenied(true) }
        else                     { setUser(result); setAccessDenied(false) }
      } catch {
        setUser(null); setAccessDenied(false)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    try { await signInWithRedirect(auth, googleProvider) }
    catch (e) { setLoading(false); throw e }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null); setAccessDenied(false)
  }

  const updateUserProfile = async (data: { name?: string; photoURL?: string }) => {
    if (!user || !auth.currentUser) return
    await updateProfile(auth.currentUser, {
      displayName: data.name     ?? auth.currentUser.displayName,
      photoURL:    data.photoURL ?? auth.currentUser.photoURL,
    })
    await updateDoc(doc(db, 'users', user.uid), { ...data, updatedAt: serverTimestamp() })
    setUser({ ...user, ...data })
  }

  return (
    <AuthContext.Provider value={{ user, loading, accessDenied, signInWithGoogle, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
