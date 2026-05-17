import express from 'express'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── ADMIN: All users ─────────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    const like = `%${search}%`
    const [rows] = await pool.query(
      `SELECT id, full_name, email, phone, country, role, is_active, created_at, last_login
       FROM users
       WHERE full_name LIKE ? OR email LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [like, like, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM users WHERE full_name LIKE ? OR email LIKE ?',
      [like, like]
    )
    return res.json({ success: true, users: rows, total, page: parseInt(page) })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Single user ───────────────────────────────────────
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, country, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' })
    return res.json({ success: true, user: rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Create user ───────────────────────────────────────
router.post('/', authenticate, requireAdmin, [
  body('full_name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { full_name, email, password, phone, country, role } = req.body
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) return res.status(409).json({ success: false, message: 'Email already exists.' })

    const hashed = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, phone, country, role) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, hashed, phone || null, country || null, role || 'user']
    )
    return res.status(201).json({ success: true, message: 'User created.', userId: result.insertId })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Update user ───────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { full_name, phone, country, role, is_active } = req.body
  try {
    await pool.query(
      `UPDATE users SET
        full_name = COALESCE(?, full_name),
        phone     = COALESCE(?, phone),
        country   = COALESCE(?, country),
        role      = COALESCE(?, role),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [full_name || null, phone || null, country || null, role || null,
       is_active !== undefined ? is_active : null, req.params.id]
    )
    return res.json({ success: true, message: 'User updated.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Toggle active ─────────────────────────────────────
router.patch('/:id/toggle-active', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?',
      [req.params.id]
    )
    return res.json({ success: true, message: 'User status toggled.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete user ───────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account.' })
  }
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
    return res.json({ success: true, message: 'User deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
