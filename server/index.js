import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import path from 'path'

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
import pool            from './db/connection.js'

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'All In One Tour API is running 🚀', timestamp: new Date() })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

app.listen(PORT, async () => {
  console.log(`\n🚀 All In One Tour API`)
  console.log(`   Running on: http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)

  // Auto-migrate tables on startup
  try {
    const TABLES = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,
        phone VARCHAR(20), country VARCHAR(80),
        role ENUM('user','admin') NOT NULL DEFAULT 'user',
        is_active TINYINT(1) NOT NULL DEFAULT 1, avatar VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login DATETIME
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT,
        full_name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL,
        phone VARCHAR(30), tour_type VARCHAR(120) NOT NULL,
        tour_date DATE NOT NULL, guests VARCHAR(10) NOT NULL DEFAULT '1',
        message TEXT, status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
        admin_notes TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL, subject VARCHAR(200), message TEXT NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0, replied_at DATETIME,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT,
        name VARCHAR(100) NOT NULL, country VARCHAR(80), tour_type VARCHAR(120),
        rating TINYINT NOT NULL DEFAULT 5, review TEXT NOT NULL,
        is_approved TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT,
        action VARCHAR(100) NOT NULL, description TEXT, ip_address VARCHAR(45),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB`,
      `INSERT IGNORE INTO users (full_name, email, password, role, is_active)
       VALUES ('Hyacinth HABINEZA','admin@allinonetour.rw',
       '$2a$12$.RDWBx3llgNe6BukRz3wP.YM/TsO/jnPi1Y3emm8Q.oAsIukfeKDa','admin',1)`,
    ]
    for (const sql of TABLES) {
      await pool.query(sql)
    }
    console.log('✅ Database tables ready')
  } catch (err) {
    console.error('⚠️  Auto-migrate warning:', err.message)
  }
})
