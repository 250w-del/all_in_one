import React, { useEffect, useState, useCallback } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaBullhorn, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const TYPE_CONFIG = {
  info:    { label: 'Info',    color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-500' },
  success: { label: 'Success', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  warning: { label: 'Warning', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  urgent:  { label: 'Urgent',  color: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500' },
}

const EMPTY_FORM = { title: '', content: '', type: 'info', is_active: true, expires_at: '' }

export default function Announcements() {
  const { authFetch } = useAuth()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/announcements/all')
      const data = await res.json()
      if (data.success) setItems(data.announcements)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setError('')
    setModal('create')
  }

  const openEdit = (item) => {
    setForm({
      title:      item.title,
      content:    item.content,
      type:       item.type,
      is_active:  item.is_active,
      expires_at: item.expires_at ? item.expires_at.split('T')[0] : '',
    })
    setEditId(item.id)
    setError('')
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSaving(true); setError('')
    try {
      const body   = { ...form, expires_at: form.expires_at || null }
      const url    = modal === 'create' ? '/api/announcements' : `/api/announcements/${editId}`
      const method = modal === 'create' ? 'POST' : 'PUT'
      const res    = await authFetch(url, { method, body: JSON.stringify(body) })
      const data   = await res.json()
      if (!data.success) { setError(data.message || 'Error saving.'); return }
      setModal(null)
      fetchAll()
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const toggleActive = async (item) => {
    await authFetch(`/api/announcements/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !item.is_active }),
    })
    fetchAll()
  }

  const deleteItem = async (id) => {
    if (!confirm('Delete this announcement?')) return
    await authFetch(`/api/announcements/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const isExpired = (item) => item.expires_at && new Date(item.expires_at) < new Date()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
          <p className="text-gray-500 text-sm">Post updates and alerts to all users</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <FaPlus size={12} /> New Announcement
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.length ? items.map(item => {
            const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG.info
            const expired = isExpired(item)
            return (
              <div key={item.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${
                  !item.is_active || expired ? 'opacity-60 border-gray-100' : 'border-gray-100'
                }`}>
                <div className="flex items-start gap-4">
                  {/* Type dot */}
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${tc.dot}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${tc.color}`}>
                        {tc.label}
                      </span>
                      {expired && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          Expired
                        </span>
                      )}
                      {!item.is_active && !expired && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>By: {item.author || 'Admin'}</span>
                      <span>Posted: {new Date(item.created_at).toLocaleDateString()}</span>
                      {item.expires_at && (
                        <span>Expires: {new Date(item.expires_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(item)}
                      className={`${item.is_active ? 'text-green-500' : 'text-gray-300'} hover:scale-110 transition-transform`}
                      title={item.is_active ? 'Active' : 'Hidden'}>
                      {item.is_active ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                    </button>
                    <button onClick={() => openEdit(item)}
                      className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                      <FaEdit size={14} />
                    </button>
                    <button onClick={() => deleteItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <FaBullhorn size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No announcements yet. Create one to notify all users.</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">
                {modal === 'create' ? 'New Announcement' : 'Edit Announcement'}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input type="text" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. New Tour Package Available!"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea rows={4} value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your announcement message here..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                    {Object.entries(TYPE_CONFIG).map(([val, cfg]) => (
                      <option key={val} value={val}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires On (optional)</label>
                  <input type="date" value={form.expires_at}
                    onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Live preview */}
              {form.title && (
                <div className={`rounded-xl p-4 border ${TYPE_CONFIG[form.type]?.color}`}>
                  <div className="font-semibold text-sm mb-1">📢 {form.title}</div>
                  {form.content && <div className="text-sm opacity-80">{form.content}</div>}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input type="checkbox" id="ann_active" checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-primary-600 w-4 h-4"
                />
                <label htmlFor="ann_active" className="text-sm font-medium text-gray-700">
                  Publish immediately (visible to all users)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCheck size={12} />}
                  {modal === 'create' ? 'Post Announcement' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
