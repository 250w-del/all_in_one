import React, { useEffect, useState, useCallback } from 'react'
import {
  FaEdit, FaTrash, FaEye, FaTimes, FaCheck,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaFlag, FaCalendarAlt, FaUser, FaEnvelope, FaPhone
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const STATUS_ICONS = {
  pending:   <FaHourglassHalf className="text-yellow-500" size={13} />,
  confirmed: <FaCheckCircle   className="text-blue-500"   size={13} />,
  completed: <FaFlag          className="text-green-500"  size={13} />,
  cancelled: <FaTimesCircle   className="text-red-500"    size={13} />,
}

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function Bookings() {
  const { authFetch } = useAuth()
  const [bookings, setBookings]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [page, setPage]           = useState(1)
  const [selected, setSelected]   = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm]   = useState({ status: '', admin_notes: '' })
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
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

  // ── Quick confirm ─────────────────────────────────────────
  const confirmBooking = async (id) => {
    setActionLoading(id + '_confirm')
    try {
      await authFetch(`/api/bookings/${id}/confirm`, { method: 'PATCH' })
      fetchBookings()
    } finally { setActionLoading(null) }
  }

  // ── Quick reject ──────────────────────────────────────────
  const rejectBooking = async () => {
    setActionLoading(rejectModal.id + '_reject')
    try {
      await authFetch(`/api/bookings/${rejectModal.id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: rejectReason }),
      })
      setRejectModal(null)
      setRejectReason('')
      fetchBookings()
    } finally { setActionLoading(null) }
  }

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
    if (!confirm('Delete this booking permanently?')) return
    await authFetch(`/api/bookings/${id}`, { method: 'DELETE' })
    fetchBookings()
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 text-sm">{total} total bookings</p>
        </div>
        {/* Status summary pills */}
        <div className="flex gap-2 flex-wrap">
          {['pending','confirmed','completed','cancelled'].map(s => {
            const count = bookings.filter(b => b.status === s).length
            return (
              <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize flex items-center gap-1 ${STATUS_COLORS[s]}`}>
                {STATUS_ICONS[s]} {s}
              </span>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}>{s}
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
                  {['#', 'Guest', 'Tour', 'Start Date', 'End Date', 'Guests', 'Status', 'Actions'].map(h => (
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
                    <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate">{b.tour_type}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{fmt(b.tour_date)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{fmt(b.end_date)}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">{b.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize flex items-center gap-1 w-fit ${STATUS_COLORS[b.status]}`}>
                        {STATUS_ICONS[b.status]} {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <button onClick={() => setSelected(b)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="View details">
                          <FaEye size={13} />
                        </button>

                        {/* Confirm — only for pending */}
                        {b.status === 'pending' && (
                          <button
                            onClick={() => confirmBooking(b.id)}
                            disabled={actionLoading === b.id + '_confirm'}
                            className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 font-medium"
                            title="Confirm booking">
                            {actionLoading === b.id + '_confirm'
                              ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              : <FaCheckCircle size={11} />
                            }
                            Confirm
                          </button>
                        )}

                        {/* Reject — only for pending */}
                        {b.status === 'pending' && (
                          <button
                            onClick={() => { setRejectModal(b); setRejectReason('') }}
                            className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                            title="Reject booking">
                            <FaTimesCircle size={11} /> Reject
                          </button>
                        )}

                        {/* Edit */}
                        <button onClick={() => openEdit(b)}
                          className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition-colors" title="Edit">
                          <FaEdit size={13} />
                        </button>

                        {/* Delete */}
                        <button onClick={() => deleteBooking(b.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                          <FaTrash size={13} />
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

      {/* ── View Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="font-bold text-gray-900">Booking #{selected.id}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border capitalize inline-flex items-center gap-1 mt-1 ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_ICONS[selected.status]} {selected.status}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {/* Guest info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser size={12} className="text-primary-500" />
                  <span className="font-semibold">{selected.full_name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <FaEnvelope size={11} className="text-primary-400" />
                  {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FaPhone size={11} className="text-primary-400" />
                    {selected.phone}
                  </div>
                )}
              </div>

              {/* Trip info */}
              <div className="bg-primary-50 rounded-xl p-4 space-y-2">
                <div className="font-semibold text-primary-800">{selected.tour_type}</div>
                <div className="flex items-center gap-4 text-xs text-primary-700">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={11} />
                    Start: <strong>{fmt(selected.tour_date)}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={11} />
                    End: <strong>{fmt(selected.end_date)}</strong>
                  </span>
                </div>
                <div className="text-xs text-primary-700">Guests: <strong>{selected.guests}</strong></div>
              </div>

              {selected.message && (
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Message from guest:</div>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-3 text-sm">{selected.message}</p>
                </div>
              )}
              {selected.admin_notes && (
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Admin notes:</div>
                  <p className="text-gray-700 bg-yellow-50 rounded-xl p-3 text-sm">{selected.admin_notes}</p>
                </div>
              )}

              {/* Quick actions inside view modal */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { confirmBooking(selected.id); setSelected(null) }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <FaCheckCircle size={14} /> Confirm Trip
                  </button>
                  <button
                    onClick={() => { setRejectModal(selected); setSelected(null); setRejectReason('') }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <FaTimesCircle size={14} /> Reject Trip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">Reject Booking #{rejectModal.id}</h3>
              <button onClick={() => setRejectModal(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-3 text-sm text-red-700">
                You are about to reject the booking for <strong>{rejectModal.full_name}</strong> — <em>{rejectModal.tour_type}</em>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for rejection (optional)</label>
                <textarea rows={3} value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Tour fully booked on selected dates..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={rejectBooking} disabled={!!actionLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-colors">
                  {actionLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaTimesCircle size={13} />}
                  Reject Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
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
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Notes</label>
                <textarea rows={3} value={editForm.admin_notes}
                  onChange={e => setEditForm({ ...editForm, admin_notes: e.target.value })}
                  placeholder="Internal notes..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit}
                  className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm hover:bg-primary-700 flex items-center justify-center gap-2">
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
