import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const isProduction = process.env.NODE_ENV === 'production'

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'all_in_one_tour',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  // SSL only for production (Aiven requires it, local XAMPP doesn't)
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
})

pool.getConnection()
  .then(conn => {
    const host = process.env.DB_HOST || 'localhost'
    console.log(`✅ MySQL connected — ${isProduction ? 'Aiven Cloud' : 'Local XAMPP'} (${host})`)
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message)
  })

export default pool
