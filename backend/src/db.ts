import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  user: process.env.POSTGRES_USER ?? 'postgres',
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DB ?? 'jlpt_db',
})

export default pool
