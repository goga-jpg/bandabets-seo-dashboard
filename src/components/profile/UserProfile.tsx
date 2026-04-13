import { useState } from 'react'
import { useAuth, UserRole } from '../../context/AuthContext'
import { Camera, Save, Crown, ShieldCheck, User, LogOut } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof User; color: string; bg: string; border: string }> = {
  super_admin: { label: 'Super Admin', icon: Crown,       color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200' },
  admin:       { label: 'Admin',       icon: ShieldCheck, color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200'  },
  member:      { label: 'Member',      icon: User,        color: 'text-gray-700',  bg: 'bg-gray-100',  border: 'border-gray-200'  },
}

export default function UserProfile() {
  const { user, signOut, updateUserProfile } = useAuth()
  const [name,       setName]       = useState(user?.name      ?? '')
  const [photoURL,   setPhotoURL]   = useState(user?.photoURL  ?? '')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [photoInput, setPhotoInput] = useState('')

  if (!user) return null

  const rc   = ROLE_CONFIG[user.role]
  const Icon = rc.icon

  const handleSave = async () => {
    setSaving(true)
    await updateUserProfile({ name: name.trim() || user.name, photoURL: photoURL || user.photoURL })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const applyPhotoURL = () => {
    if (photoInput.trim()) { setPhotoURL(photoInput.trim()); setPhotoInput('') }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Avatar + role */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          {photoURL
            ? <img src={photoURL} alt={name} className="w-20 h-20 rounded-full object-cover ring-4 ring-accent/20" />
            : <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold ring-4 ring-accent/20">
                {name?.[0]?.toUpperCase() ?? '?'}
              </div>
          }
          <span className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1">
            <Camera size={13} className="text-gray-500" />
          </span>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500 mb-2">{user.email}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${rc.bg} ${rc.color} ${rc.border}`}>
            <Icon size={12} />{rc.label}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-6 space-y-5">
        <SectionHeader title="Edit Profile" description="Update your display name and photo" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo URL</label>
          <div className="flex gap-2">
            <input
              value={photoInput}
              onChange={e => setPhotoInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={applyPhotoURL}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-accent hover:text-accent transition-colors"
            >
              Apply
            </button>
          </div>
          {photoURL && (
            <div className="mt-2 flex items-center gap-2">
              <img src={photoURL} className="w-8 h-8 rounded-full object-cover" />
              <button onClick={() => { setPhotoURL(''); setPhotoInput('') }} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
          </button>
          {saved && <span className="text-sm text-emerald-600 font-medium">Profile updated</span>}
        </div>
      </div>

      {/* Account info */}
      <div className="card p-6 space-y-3">
        <SectionHeader title="Account" description="Your account details" />
        <div className="space-y-2 text-sm">
          {[
            { label: 'Email',    value: user.email },
            { label: 'Role',     value: rc.label   },
            { label: 'Invited by', value: user.invitedBy ?? (user.role === 'super_admin' ? 'System' : '—') },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 mt-4 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  )
}
