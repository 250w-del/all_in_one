import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC: Submit review ────────────────────────────────────
router.post('/', authenticate, [
  body('review').trim().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { review, rating, tour_type } = req.body
  try {
    const [rows] = await pool.query('SELECT full_name, country FROM users WHERE id = ?', [req.user.id])
    const u = rows[0]
    await pool.query(
      'INSERT INTO testimonials (user_id, name, country, tour_type, rating, review) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, u.full_name, u.country || null, tour_type || null, rating, review]
    )
    return res.status(201).json({ success: true, message: 'Review submitted! It will appear after approval.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: All reviews ───────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { approved } = req.query
  try {
    let where = ''
    const params = []
    if (approved !== undefined) { where = 'WHERE is_approved = ?'; params.push(parseInt(approved)) }
    const [rows] = await pool.query(
      `SELECT * FROM testimonials ${where} ORDER BY created_at DESC`, params
    )
    return res.json({ success: true, reviews: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── PUBLIC: Approved reviews ─────────────────────────────────
router.get('/approved', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, country, tour_type, rating, review, created_at FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC LIMIT 10'
    )
    return res.json({ success: true, reviews: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Approve review ────────────────────────────────────
router.patch('/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE testimonials SET is_approved = 1 WHERE id = ?', [req.params.id])
    return res.json({ success: true, message: 'Review approved.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete review ─────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id])
    return res.json({ success: true, message: 'Review deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
