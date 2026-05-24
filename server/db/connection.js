/**
 * Universal DB connection — supports both PostgreSQL and MySQL
 * - Uses PostgreSQL (pg) when DATABASE_URL starts with postgres://
 * - Uses MySQL (mysql2) when MYSQL_URL or individual DB_* vars are set
 * - All routes use $1,$2... placeholders (PostgreSQL style)
 *   MySQL mode auto-converts $1 → ? before executing
 */
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const DATABASE_URL = process.env.DATABASE_URL || ''
const isPostgres   = DATABASE_URL.startsWith('postgres')
const isProduction = process.env.NODE_ENV === 'production'

let _query

if (isPostgres) {
  // ── PostgreSQL (Supabase / Railway PG) ──────────────────────
  const { default: pg } = await import('pg')
  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  })
  pool.connect()
    .then(c => { console.log('✅ PostgreSQL connected'); c.release() })
    .catch(e => console.error('❌ PostgreSQL failed:', e.message))

  _query = async (sql, params = []) => {
    const result = await pool.query(sql, params)
    return [result.rows, result.fields]
  }
} else {
  // ── MySQL (Railway MySQL / XAMPP) ────────────────────────────
  const { default: mysql } = await import('mysql2/promise')

  let pool
  if (process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL) {
    // Railway MySQL via URL
    const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL
    pool = mysql.createPool({ uri: url, ssl: { rejectUnauthorized: false }, connectionLimit: 10 })
  } else {
    pool = mysql.createPool({
      host:             process.env.DB_HOST     || 'localhost',
      port:             parseInt(process.env.DB_PORT || '3306'),
      user:             process.env.DB_USER     || 'root',
      password:         process.env.DB_PASSWORD || '',
      database:         process.env.DB_NAME     || 'all_in_one_tour',
      connectionLimit:  10,
      charset:          'utf8mb4',
      ...(isProduction && { ssl: { rejectUnauthorized: false } }),
    })
  }

  pool.getConnection()
    .then(c => { console.log('✅ MySQL connected'); c.release() })
    .catch(e => console.error('❌ MySQL failed:', e.message))

  _query = async (sql, params = []) => {
    // Convert PostgreSQL $1,$2... → MySQL ?
    let i = 0
    const mysqlSql = sql.replace(/\$\d+/g, () => '?')
    // Convert PostgreSQL RETURNING id → nothing (handle separately)
    const cleanSql = mysqlSql.replace(/\s+RETURNING\s+\w+/gi, '')
    const [rows, fields] = await pool.query(cleanSql, params)
    // If INSERT with RETURNING, simulate by returning insertId
    if (/^\s*INSERT/i.test(sql) && /RETURNING/i.test(sql)) {
      return [[{ id: rows.insertId }], fields]
    }
    return [Array.isArray(rows) ? rows : [rows], fields]
  }
}

const pool = { query: _query }
export default pool
