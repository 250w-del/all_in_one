import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaTachometerAlt, FaUsers, FaCalendarCheck, FaEnvelope,
  FaStar, FaChartBar, FaBars, FaTimes, FaSignOutAlt,
  FaLeaf, FaBell, FaUserCircle, FaHistory, FaCog,
  FaImages, FaBullhorn
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/admin',                label: 'Dashboard',     icon: FaTachometerAlt },
  { path: '/admin/bookings',       label: 'Bookings',      icon: FaCalendarCheck },
  { path: '/admin/users',          label: 'Users',         icon: FaUsers },
  { path: '/admin/messages',       label: 'Messages',      icon: FaEnvelope },
  { path: '/admin/reviews',        label: 'Reviews',       icon: FaStar },
  { path: '/admin/gallery',        label: 'Gallery',       icon: FaImages },
  { path: '/admin/announcements',  label: 'Announcements', icon: FaBullhorn },
  { path: '/admin/activity',       label: 'Activity',      icon: FaHistory },
  { path: '/admin/settings',       label: 'Settings',      icon: FaCog },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaLeaf className="text-white text-sm" />
          </div>
          <div>
            <div className="font-bold text-sm text-white leading-tight">All In One Tour</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(path)
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.full_name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaSignOutAlt size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaBars size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-gray-800 font-semibold text-base">
              {navItems.find(n => isActive(n.path))?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-primary-600 hover:text-primary-800 font-medium hidden sm:block">
              View Website ↗
            </Link>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
