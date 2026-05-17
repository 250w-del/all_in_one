import React, { useEffect, useState, useCallback } from 'react'
import { FaHistory } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Activity() {
  const { authFetch } = useAuth()
  const [logs, setLogs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const limit = 25

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit })
      const res  = await authFetch(`/api/activity?${params}`)
      const data = await res.json()
      if (data.success) { setLogs(data.logs); setTotal(data.total) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch, page])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const totalPages = Math.ceil(total / limit)

  const actionColor = (action) => {
    if (action.includes('LOGIN'))    return 'bg-blue-100 text-blue-700'
    if (action.includes('REGISTER')) return 'bg-green-100 text-green-700'
    if (action.includes('DELETE'))   return 'bg-red-100 text-red-700'
    if (action.includes('UPDATE'))   return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
        <p className="text-gray-500 text-sm">{total} total events</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.length ? logs.map(log => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaHistory size={12} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                    {log.full_name && (
                      <span className="text-sm font-medium text-gray-700">{log.full_name}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{log.description}</p>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(log.created_at).toLocaleString()} · IP: {log.ip_address || '—'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400">No activity logs yet</div>
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
    </div>
  )
}
