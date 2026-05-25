import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const { Pool } = pg

const isProduction = process.env.NODE_ENV === 'production'

// Force IPv4 for Supabase/Render compatibility
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  // Force IPv4 — prevents ENETUNREACH on Render with Supabase
  family: 4,
})

pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected successfully')
    client.release()
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err.message)
  })

// Unified query interface — returns [rows, fields] like mysql2
const query = async (sql, params = []) => {
  const result = await pool.query(sql, params)
  return [result.rows, result.fields]
}

export default { query }
export { pool }
