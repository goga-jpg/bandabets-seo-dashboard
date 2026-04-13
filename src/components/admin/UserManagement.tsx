import { useState, useEffect } from 'react'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth, UserRole, AppUser } from '../../context/AuthContext'
import { UserPlus, Copy, CheckCircle2, Trash2, ShieldCheck, User, Crown } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'

interface Invitation {
  id:        string
  email:     string
  role:      UserRole
  status:    'pending' | 'accepted'
  invitedBy: string
  token:     string
  createdAt: unknown
}

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof User; color: string; bg: string }> = {
  super_admin: { label: 'Super Admin', icon: Crown,       color: 'text-amber-600',  bg: 'bg-amber-50'   },
  admin:       { label: 'Admin',       icon: ShieldCheck, color: 'text-blue-600',   bg: 'bg-blue-50'    },
  member:      { label: 'Member',      icon: User,        color: 'text-gray-600',   bg: 'bg-gray-100'   },
}

export default function UserManagement() {
  const { user: me } = useAuth()
  const [users,       setUsers]       = useState<AppUser[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading,     setLoading]     = useState(true)
  const [invEmail,    setInvEmail]    = useState('')
  const [invRole,     setInvRole]     = useState<UserRole>('member')
  const [sending,     setSending]     = useState(false)
  const [copied,      setCopied]      = useState<string | null>(null)
  const [tab,         setTab]         = useState<'users' | 'invitations'>('users')

  const BASE_URL = window.location.origin + window.location.pathname

  const canInvite       = me?.role === 'super_admin' || me?.role === 'admin'
  const canManageAdmins = me?.role === 'super_admin'

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const [uSnap, iSnap] = await Promise.all([
      getDocs(query(collection(db, 'users'),       orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'invitations'), orderBy('createdAt', 'desc'))),
    ])
    setUsers(uSnap.docs.map(d => ({ uid: d.id, ...d.data() } as AppUser)))
    setInvitations(iSnap.docs.map(d => ({ id: d.id, ...d.data() } as Invitation)))
    setLoading(false)
  }

  const sendInvite = async () => {
    if (!invEmail.trim() || !me) return
    setSending(true)
    const token = crypto.randomUUID()
    await addDoc(collection(db, 'invitations'), {
      email:     invEmail.trim().toLowerCase(),
      role:      invRole,
      invitedBy: me.email,
      status:    'pending',
      token,
      createdAt: serverTimestamp(),
    })
    setInvEmail('')
    await fetchData()
    setSending(false)
  }

  const revokeInvitation = async (id: string) => {
    await deleteDoc(doc(db, 'invitations', id))
    await fetchData()
  }

  const changeRole = async (uid: string, role: UserRole) => {
    await updateDoc(doc(db, 'users', uid), { role })
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u))
  }

  const removeUser = async (uid: string) => {
    if (!confirm('Remove this user? They will lose access immediately.')) return
    await deleteDoc(doc(db, 'users', uid))
    setUsers(prev => prev.filter(u => u.uid !== uid))
  }

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${BASE_URL}?invite=${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!canInvite) return (
    <div className="card p-8 text-center text-gray-400 text-sm">You don't have permission to manage users.</div>
  )

  return (
    <div className="space-y-6">
      {/* Invite form */}
      <div className="card p-5">
        <SectionHeader title="Invite User" description="Send an invitation link to a new team member" />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <input
            type="email"
            value={invEmail}
            onChange={e => setInvEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={invRole}
            onChange={e => setInvRole(e.target.value as UserRole)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent bg-white"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            {canManageAdmins && <option value="super_admin">Super Admin</option>}
          </select>
          <button
            onClick={sendInvite}
            disabled={!invEmail.trim() || sending}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
          >
            <UserPlus size={15} />
            {sending ? 'Creating…' : 'Create Invite'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['users', 'invitations'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'users' ? `Users (${users.length})` : `Pending Invites (${invitations.filter(i => i.status === 'pending').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-8 text-center"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : tab === 'users' ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {['User', 'Email', 'Role', 'Invited by', ''].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const rc  = ROLE_CONFIG[u.role]
                const Icon = rc.icon
                return (
                  <tr key={u.uid} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {u.photoURL
                          ? <img src={u.photoURL} className="w-7 h-7 rounded-full object-cover" />
                          : <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">{u.name?.[0] ?? '?'}</div>
                        }
                        <span className="font-medium text-gray-800">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4">
                      {canManageAdmins && u.email !== 'goga@5dm.africa' ? (
                        <select
                          value={u.role}
                          onChange={e => changeRole(u.uid, e.target.value as UserRole)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${rc.bg} ${rc.color}`}>
                          <Icon size={11} />{rc.label}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{u.invitedBy ?? '—'}</td>
                    <td className="py-3 px-4">
                      {u.email !== 'goga@5dm.africa' && u.uid !== me?.uid && canManageAdmins && (
                        <button onClick={() => removeUser(u.uid)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {['Email', 'Role', 'Status', 'Invited by', 'Link', ''].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invitations.map(inv => {
                const rc = ROLE_CONFIG[inv.role]
                return (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{inv.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rc.bg} ${rc.color}`}>{rc.label}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inv.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {inv.status === 'accepted' ? 'Accepted' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{inv.invitedBy}</td>
                    <td className="py-3 px-4">
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => copyLink(inv.token)}
                          className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-600 font-medium"
                        >
                          {copied === inv.token ? <><CheckCircle2 size={13} className="text-emerald-500" /> Copied!</> : <><Copy size={13} /> Copy link</>}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {inv.status === 'pending' && (
                        <button onClick={() => revokeInvitation(inv.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {invitations.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No invitations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
