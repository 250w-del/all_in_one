import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaUsers, FaCalendarCheck, FaEnvelope, FaStar,
  FaClock, FaCheckCircle, FaTimesCircle, FaFlag,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function StatCard({ title, value, icon: Icon, color, sub, link }) {
  return (
    <Link to={link || '#'} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { authFetch } = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [authFetch])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const s = data?.stats || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"      value={s.totalUsers}      icon={FaUsers}         color="bg-blue-50 text-blue-600"   link="/admin/users" />
        <StatCard title="Total Bookings"   value={s.totalBookings}   icon={FaCalendarCheck} color="bg-primary-50 text-primary-600" link="/admin/bookings" />
        <StatCard title="Pending Bookings" value={s.pendingBookings} icon={FaClock}         color="bg-yellow-50 text-yellow-600" link="/admin/bookings?status=pending" />
        <StatCard title="Unread Messages"  value={s.unreadMessages}  icon={FaEnvelope}      color="bg-rose-50 text-rose-600"   link="/admin/messages" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Confirmed"  value={s.confirmedBookings} icon={FaCheckCircle} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Completed"  value={s.completedBookings} icon={FaFlag}        color="bg-green-50 text-green-600" />
        <StatCard title="Cancelled"  value={s.cancelledBookings} icon={FaTimesCircle} color="bg-red-50 text-red-600" />
        <StatCard title="Pending Reviews" value={s.pendingReviews} icon={FaStar}      color="bg-amber-50 text-amber-600" link="/admin/reviews" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentBookings?.length ? data.recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                  {b.full_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{b.full_name}</div>
                  <div className="text-xs text-gray-400 truncate">{b.tour_type}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No bookings yet</p>}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Users</h3>
            <Link to="/admin/users" className="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentUsers?.length ? data.recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                  {u.full_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{u.full_name}</div>
                  <div className="text-xs text-gray-400 truncate">{u.email}</div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{u.country || '—'}</span>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No users yet</p>}
          </div>
        </div>
      </div>

      {/* Top Tours */}
      {data?.topTours?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Most Booked Tours</h3>
          <div className="space-y-3">
            {data.topTours.map((t, i) => {
              const max = data.topTours[0].count
              return (
                <div key={t.tour_type} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{t.tour_type}</span>
                      <span className="text-gray-500">{t.count} bookings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${(t.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <Link to="/admin/activity" className="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</Link>
        </div>
        <div className="space-y-2">
          {data?.recentActivity?.length ? data.recentActivity.map(a => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-700">{a.description}</span>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(a.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          )) : <p className="text-gray-400 text-sm text-center py-4">No activity yet</p>}
        </div>
      </div>
    </div>
  )
}
