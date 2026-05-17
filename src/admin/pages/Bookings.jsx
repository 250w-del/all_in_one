import React, { useEffect, useState, useCallback } from 'react'
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaCheck } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function Bookings() {
  const { authFetch } = useAuth()
  const [bookings, setBookings] = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm]   = useState({ status: '', admin_notes: '' })
  const limit = 15

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit })
      if (filter !== 'all') params.set('status', filter)
      const res  = await authFetch(`/api/bookings?${params}`)
      const data = await res.json()
      if (data.success) { setBookings(data.bookings); setTotal(data.total) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch, filter, page])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const openEdit = (b) => {
    setEditModal(b)
    setEditForm({ status: b.status, admin_notes: b.admin_notes || '' })
  }

  const saveEdit = async () => {
    await authFetch(`/api/bookings/${editModal.id}`, {
      method: 'PUT',
      body: JSON.stringify(editForm),
    })
    setEditModal(null)
    fetchBookings()
  }

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return
    await authFetch(`/api/bookings/${id}`, { method: 'DELETE' })
    fetchBookings()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 text-sm">{total} total bookings</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {s}
          </button>
        ))}
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
                  {['#', 'Guest', 'Tour', 'Date', 'Guests', 'Status', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length ? bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{b.full_name}</div>
                      <div className="text-xs text-gray-400">{b.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{b.tour_type}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(b.tour_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">{b.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${STATUS_COLORS[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(b)} className="text-blue-500 hover:text-blue-700 p-1" title="View">
                          <FaEye size={14} />
                        </button>
                        <button onClick={() => openEdit(b)} className="text-amber-500 hover:text-amber-700 p-1" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => deleteBooking(b.id)} className="text-red-400 hover:text-red-600 p-1" title="Delete">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">Booking #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                ['Guest Name', selected.full_name],
                ['Email', selected.email],
                ['Phone', selected.phone || '—'],
                ['Tour Type', selected.tour_type],
                ['Tour Date', new Date(selected.tour_date).toLocaleDateString()],
                ['Guests', selected.guests],
                ['Status', selected.status],
                ['Submitted', new Date(selected.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-500 w-28 flex-shrink-0">{label}:</span>
                  <span className="text-gray-800 font-medium capitalize">{value}</span>
                </div>
              ))}
              {selected.message && (
                <div>
                  <span className="text-gray-500">Message:</span>
                  <p className="text-gray-700 mt-1 bg-gray-50 rounded-lg p-3">{selected.message}</p>
                </div>
              )}
              {selected.admin_notes && (
                <div>
                  <span className="text-gray-500">Admin Notes:</span>
                  <p className="text-gray-700 mt-1 bg-yellow-50 rounded-lg p-3">{selected.admin_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">Update Booking #{editModal.id}</h3>
              <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Notes</label>
                <textarea
                  rows={3}
                  value={editForm.admin_notes}
                  onChange={e => setEditForm({ ...editForm, admin_notes: e.target.value })}
                  placeholder="Internal notes..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm hover:bg-primary-700 flex items-center justify-center gap-2">
                  <FaCheck size={12} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
