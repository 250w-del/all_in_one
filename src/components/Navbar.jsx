import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaBars, FaTimes, FaMapMarkerAlt, FaPhone,
  FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt,
  FaTachometerAlt, FaChevronDown
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home',         href: '#home' },
  { label: 'Services',     href: '#services' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Gallery',      href: '#gallery' },
  { label: 'About',        href: '#about' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const { user, logout }      = useAuth()
  const navigate               = useNavigate()
  const [isOpen, setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef                 = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    setIsOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-800 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-gold-400" />
              Kigali, Rwanda
            </span>
            <span className="flex items-center gap-1">
              <FaPhone className="text-gold-400" />
              +250 795 247 707
            </span>
          </div>
          <span className="text-primary-200">Your Premier Tour Experience in Rwanda</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <span className={`font-display font-bold text-xl leading-tight block ${scrolled ? 'text-primary-800' : 'text-white'}`}>
                All In One Tour
              </span>
              <span className={`text-xs font-medium ${scrolled ? 'text-primary-600' : 'text-primary-200'}`}>
                Kigali, Rwanda
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`font-medium text-sm transition-colors duration-200 hover:text-primary-500 ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right side: auth buttons or user menu */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              /* ── Logged-in user dropdown ── */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
                    scrolled
                      ? 'border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-700'
                      : 'border-white/40 text-white hover:border-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.full_name?.split(' ')[0]}</span>
                  <FaChevronDown size={10} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <div className="text-sm font-semibold text-gray-800 truncate">{user.full_name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
                      }`}>{user.role}</span>
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <FaTachometerAlt size={13} className="text-primary-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest: Login + Register ── */
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                    scrolled
                      ? 'border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-700'
                      : 'border-white/50 text-white hover:border-white hover:bg-white/10'
                  }`}
                >
                  <FaSignInAlt size={12} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaUserPlus size={12} />
                  Register
                </Link>
              </>
            )}

            {/* Book a Tour CTA */}
            <a
              href="#contact"
              className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
                scrolled
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'
                  : 'bg-white text-primary-700 hover:bg-primary-50 shadow-md'
              }`}
            >
              Book a Tour
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white shadow-xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  {/* Logged-in mobile */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{user.full_name}</div>
                      <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                    </div>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-sm text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <FaTachometerAlt size={13} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-sm text-red-500 font-medium py-2.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt size={13} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Guest mobile */}
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <FaSignInAlt size={13} /> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <FaUserPlus size={13} /> Register
                  </Link>
                </>
              )}

              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block bg-primary-600 text-white text-center font-semibold py-3 px-6 rounded-full"
              >
                Book a Tour
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
