import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Aiven MySQL requires SSL in production
const isProduction = process.env.NODE_ENV === 'production'

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  // Aiven requires SSL — enabled automatically in production
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL (Aiven) connected successfully')
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message)
  })

export default pool
