import React, { useEffect, useState, useCallback } from 'react'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaTimes, FaEye } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Messages() {
  const { authFetch } = useAuth()
  const [messages, setMessages] = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState(null)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const limit = 15

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit })
      if (unreadOnly) params.set('unread', 'true')
      const res  = await authFetch(`/api/messages?${params}`)
      const data = await res.json()
      if (data.success) { setMessages(data.messages); setTotal(data.total) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch, page, unreadOnly])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const markRead = async (id) => {
    await authFetch(`/api/messages/${id}/read`, { method: 'PATCH' })
    fetchMessages()
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    await authFetch(`/api/messages/${id}`, { method: 'DELETE' })
    setSelected(null)
    fetchMessages()
  }

  const openMessage = async (msg) => {
    setSelected(msg)
    if (!msg.is_read) await markRead(msg.id)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-500 text-sm">{total} messages</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={unreadOnly} onChange={e => { setUnreadOnly(e.target.checked); setPage(1) }}
            className="rounded text-primary-600" />
          Unread only
        </label>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.length ? messages.map(m => (
              <div
                key={m.id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${!m.is_read ? 'bg-blue-50/40' : ''}`}
                onClick={() => openMessage(m)}
              >
                <div className={`mt-0.5 flex-shrink-0 ${m.is_read ? 'text-gray-300' : 'text-blue-500'}`}>
                  {m.is_read ? <FaEnvelopeOpen size={16} /> : <FaEnvelope size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-medium text-sm ${!m.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{m.name}</span>
                    {!m.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">{m.email}</div>
                  {m.subject && <div className="text-sm text-gray-600 font-medium truncate">{m.subject}</div>}
                  <div className="text-xs text-gray-400 truncate">{m.message}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                  <button onClick={e => { e.stopPropagation(); deleteMsg(m.id) }} className="text-red-400 hover:text-red-600 p-1">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400">No messages found</div>
            )}
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

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{selected.subject || 'Message'}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                  {selected.name[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{selected.name}</div>
                  <div className="text-sm text-gray-500">{selected.email}</div>
                </div>
                <div className="ml-auto text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                  className="flex-1 bg-primary-600 text-white text-center py-2.5 rounded-xl text-sm hover:bg-primary-700 font-medium"
                >
                  Reply via Email
                </a>
                <button onClick={() => deleteMsg(selected.id)} className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
