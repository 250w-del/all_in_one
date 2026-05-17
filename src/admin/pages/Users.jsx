import React, { useEffect, useState, useCallback } from 'react'
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaTimes, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Users() {
  const { authFetch, user: me } = useAuth()
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [modal, setModal]     = useState(null) // 'create' | 'edit'
  const [editUser, setEditUser] = useState(null)
  const [form, setForm]       = useState({ full_name: '', email: '', password: '', phone: '', country: '', role: 'user' })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const limit = 15

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit, search })
      const res  = await authFetch(`/api/users?${params}`)
      const data = await res.json()
      if (data.success) { setUsers(data.users); setTotal(data.total) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch, page, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setForm({ full_name: '', email: '', password: '', phone: '', country: '', role: 'user' })
    setError('')
    setModal('create')
  }

  const openEdit = (u) => {
    setEditUser(u)
    setForm({ full_name: u.full_name, email: u.email, password: '', phone: u.phone || '', country: u.country || '', role: u.role })
    setError('')
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      let res
      if (modal === 'create') {
        res = await authFetch('/api/users', { method: 'POST', body: JSON.stringify(form) })
      } else {
        const body = { ...form }
        if (!body.password) delete body.password
        res = await authFetch(`/api/users/${editUser.id}`, { method: 'PUT', body: JSON.stringify(body) })
      }
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Error saving user.'); return }
      setModal(null)
      fetchUsers()
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const toggleActive = async (id) => {
    await authFetch(`/api/users/${id}/toggle-active`, { method: 'PATCH' })
    fetchUsers()
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    await authFetch(`/api/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-500 text-sm">{total} registered users</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <FaUserPlus size={14} /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'User', 'Phone', 'Country', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length ? users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                          {u.full_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{u.full_name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{u.country || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="text-amber-500 hover:text-amber-700 p-1" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => toggleActive(u.id)} className={`p-1 ${u.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`} title="Toggle active">
                          {u.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                        </button>
                        {u.id !== me?.id && (
                          <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-600 p-1" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{modal === 'create' ? 'Add New User' : 'Edit User'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              {[
                ['full_name', 'Full Name *', 'text'],
                ['email', 'Email *', 'email'],
                ['password', modal === 'create' ? 'Password *' : 'New Password (leave blank to keep)', 'password'],
                ['phone', 'Phone', 'tel'],
                ['country', 'Country', 'text'],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCheck size={12} />}
                  {modal === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
