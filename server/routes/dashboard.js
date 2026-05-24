import express from 'express'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const q = async (sql, params) => {
      const [rows] = await pool.query(sql, params)
      return parseInt(rows[0].total || rows[0].count || 0)
    }

    const totalUsers        = await q("SELECT COUNT(*) as total FROM users WHERE role='user'")
    const totalBookings     = await q('SELECT COUNT(*) as total FROM bookings')
    const pendingBookings   = await q("SELECT COUNT(*) as total FROM bookings WHERE status='pending'")
    const confirmedBookings = await q("SELECT COUNT(*) as total FROM bookings WHERE status='confirmed'")
    const completedBookings = await q("SELECT COUNT(*) as total FROM bookings WHERE status='completed'")
    const cancelledBookings = await q("SELECT COUNT(*) as total FROM bookings WHERE status='cancelled'")
    const unreadMessages    = await q('SELECT COUNT(*) as total FROM contact_messages WHERE is_read=FALSE')
    const totalMessages     = await q('SELECT COUNT(*) as total FROM contact_messages')
    const pendingReviews    = await q('SELECT COUNT(*) as total FROM testimonials WHERE is_approved=FALSE')

    // Bookings per month (last 6 months) — PostgreSQL syntax
    const [monthlyBookings] = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon YYYY') as month,
             COUNT(*) as count
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM'), TO_CHAR(created_at, 'Mon YYYY')
      ORDER BY MIN(created_at)
    `)

    const [topTours] = await pool.query(`
      SELECT tour_type, COUNT(*) as count
      FROM bookings
      GROUP BY tour_type
      ORDER BY count DESC
      LIMIT 5
    `)

    const [recentBookings] = await pool.query(`
      SELECT id, full_name, email, tour_type, tour_date, status, created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 5
    `)

    const [recentUsers] = await pool.query(`
      SELECT id, full_name, email, country, created_at
      FROM users
      WHERE role = 'user'
      ORDER BY created_at DESC
      LIMIT 5
    `)

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
        totalUsers, totalBookings, pendingBookings, confirmedBookings,
        completedBookings, cancelledBookings, unreadMessages, totalMessages, pendingReviews,
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
