import express from 'express'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, limit = 25 } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)
  try {
    const [logs] = await pool.query(
      `SELECT al.*, u.full_name, u.email
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    )
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM activity_logs')
    return res.json({ success: true, logs, total: parseInt(countRows[0].total) })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
