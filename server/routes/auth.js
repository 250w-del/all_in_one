import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Helper: generate JWT
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// Helper: log activity
const logActivity = async (userId, action, description, ip) => {
  try {
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
      [userId, action, description, ip]
    )
  } catch (_) {}
}

// ─── REGISTER ────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    body('country').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { full_name, email, password, phone, country } = req.body

    try {
      // Check duplicate email
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing.length) {
        return res.status(409).json({ success: false, message: 'Email already registered.' })
      }

      const hashed = await bcrypt.hash(password, 12)
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, phone, country) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, hashed, phone || null, country || null]
      )

      const userId = result.insertId
      await logActivity(userId, 'REGISTER', `New user registered: ${email}`, req.ip)

      const user = { id: userId, email, role: 'user' }
      const token = signToken(user)

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: userId, full_name, email, role: 'user' },
      })
    } catch (err) {
      console.error('Register error:', err)
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' })
    }
  }
)

// ─── LOGIN ───────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const [rows] = await pool.query(
        'SELECT id, full_name, email, password, role, is_active FROM users WHERE email = ?',
        [email]
      )

      if (!rows.length) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      const user = rows[0]

      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      // Update last login
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])
      await logActivity(user.id, 'LOGIN', `User logged in: ${email}`, req.ip)

      const token = signToken(user)

      return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (err) {
      console.error('Login error:', err)
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' })
    }
  }
)

// ─── GET CURRENT USER ────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, country, role, avatar, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' })
    return res.json({ success: true, user: rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── UPDATE PROFILE ──────────────────────────────────────────
router.put('/profile', authenticate, [
  body('full_name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('country').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { full_name, phone, country } = req.body
  try {
    await pool.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), country = COALESCE(?, country) WHERE id = ?',
      [full_name || null, phone || null, country || null, req.user.id]
    )
    return res.json({ success: true, message: 'Profile updated.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── CHANGE PASSWORD ─────────────────────────────────────────
router.put('/change-password', authenticate, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { current_password, new_password } = req.body
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id])
    const match = await bcrypt.compare(current_password, rows[0].password)
    if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect.' })

    const hashed = await bcrypt.hash(new_password, 12)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id])
    return res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
