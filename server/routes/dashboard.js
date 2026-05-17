import express from 'express'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── ADMIN: Dashboard stats ───────────────────────────────────
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [[{ totalUsers }]]     = await pool.query("SELECT COUNT(*) as totalUsers FROM users WHERE role='user'")
    const [[{ totalBookings }]]  = await pool.query('SELECT COUNT(*) as totalBookings FROM bookings')
    const [[{ pendingBookings }]]= await pool.query("SELECT COUNT(*) as pendingBookings FROM bookings WHERE status='pending'")
    const [[{ confirmedBookings }]] = await pool.query("SELECT COUNT(*) as confirmedBookings FROM bookings WHERE status='confirmed'")
    const [[{ completedBookings }]] = await pool.query("SELECT COUNT(*) as completedBookings FROM bookings WHERE status='completed'")
    const [[{ cancelledBookings }]] = await pool.query("SELECT COUNT(*) as cancelledBookings FROM bookings WHERE status='cancelled'")
    const [[{ unreadMessages }]] = await pool.query("SELECT COUNT(*) as unreadMessages FROM contact_messages WHERE is_read=0")
    const [[{ totalMessages }]]  = await pool.query('SELECT COUNT(*) as totalMessages FROM contact_messages')
    const [[{ pendingReviews }]] = await pool.query("SELECT COUNT(*) as pendingReviews FROM testimonials WHERE is_approved=0")

    // Bookings per month (last 6 months)
    const [monthlyBookings] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') as month,
             COUNT(*) as count
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY MIN(created_at)
    `)

    // Top tour types
    const [topTours] = await pool.query(`
      SELECT tour_type, COUNT(*) as count
      FROM bookings
      GROUP BY tour_type
      ORDER BY count DESC
      LIMIT 5
    `)

    // Recent bookings
    const [recentBookings] = await pool.query(`
      SELECT id, full_name, email, tour_type, tour_date, status, created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 5
    `)

    // Recent users
    const [recentUsers] = await pool.query(`
      SELECT id, full_name, email, country, created_at
      FROM users
      WHERE role = 'user'
      ORDER BY created_at DESC
      LIMIT 5
    `)

    // Recent activity logs
    const [recentActivity] = await pool.query(`
      SELECT al.*, u.full_name, u.email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `)

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        unreadMessages,
        totalMessages,
        pendingReviews,
      },
      monthlyBookings,
      topTours,
      recentBookings,
      recentUsers,
      recentActivity,
    })
  } catch (err) {
    console.error('Dashboard stats error:', err)
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
