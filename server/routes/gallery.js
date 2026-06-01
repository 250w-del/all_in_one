import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC: Get all active images ───────────────────────────
router.get('/', async (req, res) => {
  const { category } = req.query
  try {
    const where  = category ? `WHERE is_active = TRUE AND category = $1` : `WHERE is_active = TRUE`
    const params = category ? [category] : []
    const [rows] = await pool.query(
      `SELECT * FROM gallery_images ${where} ORDER BY sort_order ASC, created_at DESC`,
      params
    )
    return res.json({ success: true, images: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Get all images (including inactive) ───────────────
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC`
    )
    return res.json({ success: true, images: rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Create image ──────────────────────────────────────
router.post('/', authenticate, requireAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('image_url').trim().notEmpty().withMessage('Image URL is required'),
  body('category').optional().trim(),
  body('description').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  const { title, description, image_url, category, sort_order } = req.body
  try {
    const [rows] = await pool.query(
      `INSERT INTO gallery_images (title, description, image_url, category, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description || null, image_url, category || 'General', sort_order || 0]
    )
    return res.status(201).json({ success: true, message: 'Image added.', image: rows[0] })
  } catch (err) {
    console.error('Gallery create error:', err.message)
    return res.status(500).json({ success: false, message: err.message || 'Server error.' })
  }
})

// ─── ADMIN: Update image ──────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { title, description, image_url, category, is_active, sort_order } = req.body
  try {
    const [rows] = await pool.query(
      `UPDATE gallery_images SET
        title       = COALESCE($1, title),
        description = COALESCE($2, description),
        image_url   = COALESCE($3, image_url),
        category    = COALESCE($4, category),
        is_active   = COALESCE($5, is_active),
        sort_order  = COALESCE($6, sort_order),
        updated_at  = NOW()
       WHERE id = $7 RETURNING *`,
      [title || null, description || null, image_url || null,
       category || null, is_active !== undefined ? is_active : null,
       sort_order !== undefined ? sort_order : null, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'Image not found.' })
    return res.json({ success: true, message: 'Image updated.', image: rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── ADMIN: Delete image ──────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery_images WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Image deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
})

export default router
