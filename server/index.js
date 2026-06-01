import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

import authRoutes         from './routes/auth.js'
import bookingRoutes      from './routes/bookings.js'
import userRoutes         from './routes/users.js'
import dashboardRoutes    from './routes/dashboard.js'
import messageRoutes      from './routes/messages.js'
import reviewRoutes       from './routes/reviews.js'
import activityRoutes     from './routes/activity.js'
import galleryRoutes      from './routes/gallery.js'
import announcementRoutes from './routes/announcements.js'
import pool               from './db/connection.js'

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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

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
app.use('/api/auth',          authRoutes)
app.use('/api/bookings',      bookingRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/dashboard',     dashboardRoutes)
app.use('/api/messages',      messageRoutes)
app.use('/api/reviews',       reviewRoutes)
app.use('/api/activity',      activityRoutes)
app.use('/api/gallery',       galleryRoutes)
app.use('/api/announcements', announcementRoutes)

// Route list for debugging
app.get('/api/routes', (req, res) => {
  res.json({ routes: [
    '/api/auth', '/api/bookings', '/api/users', '/api/dashboard',
    '/api/messages', '/api/reviews', '/api/activity',
    '/api/gallery', '/api/announcements'
  ]})
})

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'All In One Tour API is running 🚀', 
    version: '2.0.0',
    timestamp: new Date() 
  })
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

  // Auto-migrate PostgreSQL tables on startup
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,
        phone VARCHAR(20), country VARCHAR(80),
        role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
        is_active BOOLEAN NOT NULL DEFAULT TRUE, avatar VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE SET NULL,
        full_name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL,
        phone VARCHAR(30), tour_type VARCHAR(120) NOT NULL,
        tour_date DATE NOT NULL,
        end_date DATE,
        guests VARCHAR(10) NOT NULL DEFAULT '1',
        message TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
        admin_notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      -- Add end_date if it doesn't exist yet
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_date DATE;
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL, subject VARCHAR(200), message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE, replied_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(100) NOT NULL, country VARCHAR(80), tour_type VARCHAR(120),
        rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
        review TEXT NOT NULL, is_approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL, description TEXT, ip_address VARCHAR(45),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      INSERT INTO users (full_name, email, password, role, is_active)
      VALUES ('Hyacinth HABINEZA','admin@allinonetour.rw',
        '$2a$12$.RDWBx3llgNe6BukRz3wP.YM/TsO/jnPi1Y3emm8Q.oAsIukfeKDa','admin',TRUE)
      ON CONFLICT (email) DO NOTHING;
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category VARCHAR(80) NOT NULL DEFAULT 'General',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      -- Fix existing column if it was VARCHAR(500)
      ALTER TABLE gallery_images ALTER COLUMN image_url TYPE TEXT;
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info','warning','success','urgent')),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        expires_at TIMESTAMP,
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ Database tables ready')
  } catch (err) {
    console.error('⚠️  Auto-migrate warning:', err.message)
  }
})
