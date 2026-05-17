import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

// In production (Vercel), VITE_API_URL points to your Render backend.
// In development, Vite proxy handles /api → localhost:5000.
const API_BASE = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('aiot_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.user)
        else logout()
      })
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token])

  const login = useCallback((userData, jwt) => {
    localStorage.setItem('aiot_token', jwt)
    setToken(jwt)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('aiot_token')
    setToken(null)
    setUser(null)
  }, [])

  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
    return res
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
