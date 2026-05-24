/**
 * Migration script — works with both MySQL and PostgreSQL
 * Run: node db/migrate.js
 */
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const MYSQL_TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    country    VARCHAR(80),
    role       ENUM('user','admin') NOT NULL DEFAULT 'user',
    is_active  TINYINT(1) NOT NULL DEFAULT 1,
    avatar     VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS bookings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    phone       VARCHAR(30),
    tour_type   VARCHAR(120) NOT NULL,
    tour_date   DATE NOT NULL,
    guests      VARCHAR(10) NOT NULL DEFAULT '1',
    message     TEXT,
    status      ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    is_read    TINYINT(1) NOT NULL DEFAULT 0,
    replied_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS testimonials (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    name        VARCHAR(100) NOT NULL,
    country     VARCHAR(80),
    tour_type   VARCHAR(120),
    rating      TINYINT NOT NULL DEFAULT 5,
    review      TEXT NOT NULL,
    is_approved TINYINT(1) NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS activity_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    action      VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address  VARCHAR(45),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB`,

  `INSERT IGNORE INTO users (full_name, email, password, role, is_active)
   VALUES (
     'Hyacinth HABINEZA',
     'admin@allinonetour.rw',
     '$2a$12$.RDWBx3llgNe6BukRz3wP.YM/TsO/jnPi1Y3emm8Q.oAsIukfeKDa',
     'admin', 1
   )`,
]

async function migrate() {
  console.log('🔄 Running database migration...')
  const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL
  let conn

  try {
    if (url) {
      conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: false } })
    } else {
      conn = await mysql.createConnection({
        host:     process.env.DB_HOST || 'localhost',
        port:     parseInt(process.env.DB_PORT || '3306'),
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'all_in_one_tour',
        ssl:      process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      })
    }

    console.log('✅ Connected')
    for (const sql of MYSQL_TABLES) {
      await conn.query(sql)
    }
    console.log('✅ Migration complete — all tables created')
    console.log('✅ Admin user seeded (admin@allinonetour.rw / Admin@2024)')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    if (conn) await conn.end()
  }
}

migrate()
