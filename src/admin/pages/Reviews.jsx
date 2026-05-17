import React, { useEffect, useState, useCallback } from 'react'
import { FaStar, FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Reviews() {
  const { authFetch } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('pending') // 'pending' | 'approved' | 'all'

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('approved', filter === 'approved' ? '1' : '0')
      const res  = await authFetch(`/api/reviews?${params}`)
      const data = await res.json()
      if (data.success) setReviews(data.reviews)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch, filter])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const approve = async (id) => {
    await authFetch(`/api/reviews/${id}/approve`, { method: 'PATCH' })
    fetchReviews()
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    await authFetch(`/api/reviews/${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Reviews & Testimonials</h2>
        <p className="text-gray-500 text-sm">Manage user-submitted reviews</p>
      </div>

      <div className="flex gap-2">
        {['pending', 'approved', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length ? reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.country} · {r.tour_type}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} className={i < r.rating ? 'text-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{r.review}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{r.is_approved ? 'Approved' : 'Pending'}</span>
                <div className="flex gap-2">
                  {!r.is_approved && (
                    <button onClick={() => approve(r.id)} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                      <FaCheck size={10} /> Approve
                    </button>
                  )}
                  <button onClick={() => deleteReview(r.id)} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <FaTrash size={10} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              No reviews found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
