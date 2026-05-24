import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC: Submit booking ───────────────────────────────────
router.post('/', [
  body('full_name').trim().notEmpty().withMessage('Full name required'),
  body('email').isEmail().normalizeEmail(),
  body('tour_type').trim().notEmpty().withMessage('Tour type required'),
  body('tour_date').isDate().withMessage('Valid date required'),
  body('guests').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { full_name, email, phone, tour_type, tour_date, guests, message } = req.body
  const userId = req.user?.id || null

  try {
    const [rows] = await pool.query(
      `INSERT INTO bookings (user_id, full_name, email, phone, tour_type, tour_date, guests, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, full_name, email, phone || null, tour_type, tour_date, guests, message || null]
    )
    return res.status(201).json({
      success: true,
      message: 'Booking request submitted! We will contact you within 24 hours.',
      bookingId: rows[0].id,
    })
  } catch (err) {
    console.error('Booking error:', err)
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── USER: My bookings ────────────────────────────────────────
router.get('/my', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    return res.json({ success: true, bookings: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: All bookings ──────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    let where = ''
    const params = []
    if (status) {
      params.push(status)
      where = `WHERE status = $${params.length}`
    }

    const limitIdx  = params.length + 1
    const offsetIdx = params.length + 2

    const [rows] = await pool.query(
      `SELECT * FROM bookings ${where} ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...params, parseInt(limit), offset]
    )
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM bookings ${where}`, params
    )
    return res.json({
      success: true,
      bookings: rows,
      total: parseInt(countRows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Update booking status ────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { status, admin_notes } = req.body
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' })
  }
  try {
    await pool.query(
      `UPDATE bookings SET
        status      = COALESCE($1, status),
        admin_notes = COALESCE($2, admin_notes),
        updated_at  = NOW()
       WHERE id = $3`,
      [status || null, admin_notes || null, req.params.id]
    )
    return res.json({ success: true, message: 'Booking updated.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete booking ────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Booking deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
