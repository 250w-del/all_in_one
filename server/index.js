import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import path from 'path'

// Load .env from server/ directory regardless of where node is run from
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

import authRoutes      from './routes/auth.js'
import bookingRoutes   from './routes/bookings.js'
import userRoutes      from './routes/users.js'
import dashboardRoutes from './routes/dashboard.js'
import messageRoutes   from './routes/messages.js'
import reviewRoutes    from './routes/reviews.js'
import activityRoutes  from './routes/activity.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://all-in-one-pi-flax.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
})

app.use('/api', limiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/users',     userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/messages',  messageRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/activity',  activityRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'All In One Tour API is running 🚀', timestamp: new Date() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 All In One Tour API`)
  console.log(`   Running on: http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)
})
