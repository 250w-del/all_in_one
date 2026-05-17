import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC: Submit contact message ──────────────────────────
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { name, email, subject, message } = req.body
  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || null, message]
    )
    return res.status(201).json({ success: true, message: 'Message sent successfully!' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: All messages ──────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, limit = 20, unread } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)
  try {
    let where = ''
    const params = []
    if (unread === 'true') { where = 'WHERE is_read = 0'; }

    const [rows] = await pool.query(
      `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM contact_messages ${where}`, params)
    return res.json({ success: true, messages: rows, total })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Mark as read ──────────────────────────────────────
router.patch('/:id/read', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [req.params.id])
    return res.json({ success: true, message: 'Marked as read.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete message ────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id])
    return res.json({ success: true, message: 'Message deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
