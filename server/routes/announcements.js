import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC: Get active announcements ────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, content, type, created_at
       FROM announcements
       WHERE is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC`
    )
    return res.json({ success: true, announcements: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Get all announcements ─────────────────────────────
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.full_name as author
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       ORDER BY a.created_at DESC`
    )
    return res.json({ success: true, announcements: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Create announcement ───────────────────────────────
router.post('/', authenticate, requireAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('type').optional().isIn(['info', 'warning', 'success', 'urgent']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { title, content, type, expires_at } = req.body
  try {
    const [rows] = await pool.query(
      `INSERT INTO announcements (title, content, type, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, content, type || 'info', expires_at || null, req.user.id]
    )
    return res.status(201).json({ success: true, message: 'Announcement posted!', announcement: rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Update announcement ───────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { title, content, type, is_active, expires_at } = req.body
  try {
    const [rows] = await pool.query(
      `UPDATE announcements SET
        title      = COALESCE($1, title),
        content    = COALESCE($2, content),
        type       = COALESCE($3, type),
        is_active  = COALESCE($4, is_active),
        expires_at = COALESCE($5, expires_at),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [title || null, content || null, type || null,
       is_active !== undefined ? is_active : null,
       expires_at || null, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found.' })
    return res.json({ success: true, message: 'Announcement updated.', announcement: rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete announcement ───────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Announcement deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
