import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public site
import Navbar             from './components/Navbar'
import Hero               from './components/Hero'
import Services           from './components/Services'
import Destinations       from './components/Destinations'
import WhyChooseUs        from './components/WhyChooseUs'
import Gallery            from './components/Gallery'
import Testimonials       from './components/Testimonials'
import ContactSection     from './components/ContactSection'
import Footer             from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'

// Auth pages
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Admin
import AdminLayout    from './admin/AdminLayout'
import Dashboard      from './admin/pages/Dashboard'
import Bookings       from './admin/pages/Bookings'
import Users          from './admin/pages/Users'
import Messages       from './admin/pages/Messages'
import Reviews        from './admin/pages/Reviews'
import Activity       from './admin/pages/Activity'
import Settings       from './admin/pages/Settings'
import GalleryManager from './admin/pages/GalleryManager'
import Announcements  from './admin/pages/Announcements'

// Public homepage
function HomePage() {
  return (
    <div className="min-h-screen">
      <AnnouncementBanner />
      <Navbar />
      <Hero />
      <Services />
      <Destinations />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  )
}

// Protected admin route
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <AdminLayout>{children}</AdminLayout>
}

// Redirect logged-in users away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Admin */}
      <Route path="/admin"                element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/bookings"       element={<AdminRoute><Bookings /></AdminRoute>} />
      <Route path="/admin/users"          element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/messages"       element={<AdminRoute><Messages /></AdminRoute>} />
      <Route path="/admin/reviews"        element={<AdminRoute><Reviews /></AdminRoute>} />
      <Route path="/admin/gallery"        element={<AdminRoute><GalleryManager /></AdminRoute>} />
      <Route path="/admin/announcements"  element={<AdminRoute><Announcements /></AdminRoute>} />
      <Route path="/admin/activity"       element={<AdminRoute><Activity /></AdminRoute>} />
      <Route path="/admin/settings"       element={<AdminRoute><Settings /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
