import React, { useState } from 'react'
import { FaCheck, FaLock, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const { user, authFetch } = useAuth()

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    country: user?.country || '',
  })
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [pwMsg, setPwMsg]           = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [pwErr, setPwErr]           = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw]           = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true); setProfileMsg(''); setProfileErr('')
    try {
      const res  = await authFetch('/api/auth/profile', { method: 'PUT', body: JSON.stringify(profileForm) })
      const data = await res.json()
      if (data.success) setProfileMsg('Profile updated successfully!')
      else setProfileErr(data.message || 'Error updating profile.')
    } catch { setProfileErr('Network error.') }
    finally { setSavingProfile(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg(''); setPwErr('')
    if (pwForm.new_password !== pwForm.confirm) { setPwErr('Passwords do not match.'); return }
    setSavingPw(true)
    try {
      const res  = await authFetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password }),
      })
      const data = await res.json()
      if (data.success) { setPwMsg('Password changed successfully!'); setPwForm({ current_password: '', new_password: '', confirm: '' }) }
      else setPwErr(data.message || 'Error changing password.')
    } catch { setPwErr('Network error.') }
    finally { setSavingPw(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm">Manage your admin account</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
            <FaUser size={16} />
          </div>
          <h3 className="font-semibold text-gray-900">Profile Information</h3>
        </div>

        {profileMsg && <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-4">{profileMsg}</div>}
        {profileErr && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">{profileErr}</div>}

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={profileForm.full_name}
                onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input type="tel" value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <input type="text" value={profileForm.country}
                onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
          </div>
          <button type="submit" disabled={savingProfile}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-70">
            {savingProfile ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCheck size={12} />}
            Save Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <FaLock size={16} />
          </div>
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </div>

        {pwMsg && <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-4">{pwMsg}</div>}
        {pwErr && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">{pwErr}</div>}

        <form onSubmit={changePassword} className="space-y-4">
          {[
            ['current_password', 'Current Password'],
            ['new_password', 'New Password'],
            ['confirm', 'Confirm New Password'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input type="password" value={pwForm[key]}
                onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
          ))}
          <button type="submit" disabled={savingPw}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-70">
            {savingPw ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaLock size={12} />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
